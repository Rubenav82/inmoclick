import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarJWT, generarId } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const formularioLogin = (req, res) => { //Cuando se llama a esta función se manda como respuesta un JSON con los atributos necesarios
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF. Todos los formularios lo van a tener que tener y se lo tendremos que enviar.
    })
}

const autenticar = async (req, res) => { //Cuando se llama a esta función se revisa la autenticación del usuario.

    let resultado = validationResult(req); //Guardamos el resultado de la validación si hay errores.

    //Antes de insertar nada, verificamos que la variable "resultado" está vacía, que no hay errores de validación.
    if (!resultado.isEmpty()) {
        // Si hay errores enviamos de nuevo a la página de registro pero enviamos el array con los errores.
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            errores: resultado.array(),
            //Le pasamos también las respuestas que se hayan enviado para evitar tener que volver a incluirlas en el formulario
            csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        })
    }

    //Comprobar si el usuario existe
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        // Si no existe el usuario.
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            errores: [{ msg: 'El usuario no existe.' }], // Le pasamos los errores en un array porque es lo que espera.
            csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        })
    }

    // Comprobar si el usuario está confirmado
    if(!usuario.confirmado){
        // Si el usuario no está confirmado
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            errores: [{ msg: 'Tu cuenta aún no ha sido confirmada.' }], // Le pasamos los errores en un array porque es lo que espera.
            csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        })
    }

    // Revisar el password
    if(!usuario.verificarPassword(password)){ // Si retorna false significa que el password es incorrecto
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            errores: [{ msg: 'El password es incorrecto.' }], // Le pasamos los errores en un array porque es lo que espera.
            csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        })
    }

    // Si todo ha ido bien, autenticamos al usuario.
    // Con la función que hemos creado para generar tokens en "helpers/token.js", le pasamos como parámetro un objeto con el id del usuario y el nombre. Nos generará un token con toda la información, si el token generado lo pegamos en la página de jwt nos lo descifra e indica su contenido.    
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre});

    req.session.user = token;
    
    res.redirect('/mis-propiedades');
}

const cerrarSesion = async (req, res) => {
    // Eliminamos la sesión con la información del usuario, enviamos status 200 para indicar que todo fue bien, y redirigimos a login.
    req.session.destroy();
    return res.status(200).redirect('/');
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF. Todos los formularios lo van a tener que tener y se lo tendremos que enviar.
    })
}

const registrar = async (req, res) => {

    let resultado = validationResult(req); //Guardamos el resultado de la validación si hay errores.

    //Antes de insertar nada, verificamos que la variable "resultado" está vacía, que no hay errores de validación.
    if (!resultado.isEmpty()) {
        // Si hay errores enviamos de nuevo a la página de registro pero enviamos el array con los errores.
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            //Le pasamos también las respuestas que se hayan enviado para evitar tener que volver a incluirlas en el formulario
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            },
            csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        })
    }

    //Verificar que el usuario no está duplicado. Lo hacemos con la función findOne, donde le enviamos la condición, el campo de la tabla en el que queremos buscar y el valor buscado, que es el email insertado en formulario.
    const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } });
    if (existeUsuario) {
        //Retornamos el error metido a mano en el mismo formato que los anteriores para reutilizar el mismo código en Pug.
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'El Usuario ya está registrado.' }],
            //Le pasamos también las respuestas que se hayan enviado para evitar tener que volver a incluirlas en el formulario
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            },
            csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        })
    }

    //Creamos el usuario con la información del formulario y lo almacenamos en una constante. Lo hacemos en await para bloquear el código, ya que puede que tarde un poco la insercción. Se suele usar cuando interactuamos con base de datos.
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: generarId() //Este token es para enviárselo al usuario que se ha dado de alta por email y que confirme el alta en el sistema. Utilizamos la función generarId() que hemos creado.
    });

    // Envía email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    // Mostrar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace.',
    });
}

//Función que comprueba una cuenta. Al parámetro lo tenemos que llamar igual que se ha definido en el routing dinámico.
const confirmar = async (req, res) => {
    const { token } = req.params;

    //Verificar si el token es válido.
    const usuario = await Usuario.findOne({ where: { token: token } });

    //Si no hay usuario, si no existe enviamos a página de error.
    if (!usuario) {
        return res.render('auth/confirmar_cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        });
    }

    //Confirmar la cuenta.  Si el usuario existe eliminamos el token porque tiene que ser de un solo uso y ponemos al usuario como confirmado.
    usuario.token = null; //Eliminamos el token del usuario.
    usuario.confirmado = true; //Marcamos como confirmado.
    usuario.save(); //Guardamos estos cambios en la base de datos.

    //Mostramos una vista para que no se quede la página recargando si dirigir a ningún sitio.
    res.render('auth/confirmar_cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmó correctamente',
        error: false
    });
}


const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken() //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
    })
}

const resetPassword = async (req, res) => {

    let resultado = validationResult(req); //Guardamos el resultado de la validación si hay errores.

    //Antes de insertar nada, verificamos que la variable "resultado" está vacía, que no hay errores de validación.
    if (!resultado.isEmpty()) {
        // Si hay errores enviamos de nuevo a la página de registro pero enviamos el array con los errores.
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
            errores: resultado.array()
        })
    }

    //Si no hay errores buscamos al usuario
    const usuario = await Usuario.findOne({ where: { email: req.body.email } });
    // Si el usuario no existe
    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
            errores: [{ msg: 'El email no pertenece a ningún usuario.' }]
        })
    }

    //Si el usuario existe, generamos token, lo guardamos y enviamos email.
    usuario.token = generarId();
    await usuario.save();

    //Enviar email, le pasamos un objeto con la información necesaria para el envío y el cuerpo del email.
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });

    //Renderizar a una pantalla con mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones.',
    });
}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token: token } });

    if (!usuario) {
        return res.render('auth/confirmar_cuenta', {
            pagina: 'Restable tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        });
    }

    // En caso de que el token sea válido renderizamos a un formulario para regenerar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
    });
}

const nuevoPassword = async (req, res) => {

    let resultado = validationResult(req); //Guardamos el resultado de la validación si hay errores.

    //Antes de insertar nada, verificamos que la variable "resultado" está vacía, que no hay errores de validación.
    if (!resultado.isEmpty()) {
        // Si hay errores enviamos de nuevo a la página de registro pero enviamos el array con los errores.
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
            errores: resultado.array()
        })
    }

    // Si no hay errore, extraemos el token y el password del usuario que está intentando resetear
    const { token } = req.params;
    const { password } = req.body;

    //Verificar quién hace el cambio
    const usuario = await Usuario.findOne({ where: { token: token } });

    //Hashear el nuevo password y eliminamos el token pues es de un solo uso.
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar_cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El password se cambió correctamente.'
    })
}



export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
} //export default solo puedes tener uno por archivo, pero nombrado, puedes tener varios.