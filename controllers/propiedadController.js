import { unlink } from 'node:fs/promises'; //Funcionalidad para eliminar las imágenes asociadas a una propiedad en caso de eliminar propiedad.
import { validationResult } from 'express-validator'; //Importamos la función validationResult, que es la que va a leer el resultado de la validación y nos va a decir si hubo o no errores en función de las reglas definidas.
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js';
import { esVendedor, formatearFecha } from '../helpers/index.js'; //Importamos helper para comprobar si el usuario que ve una propiedad es el que la publicó, formatear la fecha
import { emailContacto } from '../helpers/emails.js'; //Para enviar el email cada vez que alguien quiere contactar con el vendedor


// Función que renderiza a la vista admin de propiedades
const admin = async (req, res) => {
    // Leer QueryString, para leer de la url la página que se está visualizando de la tabla paginada. En este caso no se pasa como parámetro en el routing, si no como query en la url
    const { pagina: paginaActual } = req.query; //Leemos el parámetro con query y le renombramos a paginaActual para no confundir con el parámetro pagina que pasamos en el render de la vista.

    //Validamos que paginaActual existe y es un número positivo que contiene dígitos del 0 al 9, y no se incluya texto. Le indicamos que debe comenzar y acabar en un número.
    const expresionRegular = /^[1-9]$/;

    if (!expresionRegular.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1');
    }

    try {
        //Extraemos el id del usuario que se pasa desde el middleware protegerRuta.js, que a su vez lo extrae del JWT almacenado en una cookie.
        const { id } = req.usuario;

        // Límites y Offset para el paginador
        const limit = 5; //Límite de registros a mostrar en cada página
        const offset = ((paginaActual * limit) - limit); //Para saber el número de registros que nos tenemos que saltar

        //Extraemos las propiedades del usuario por su id. Utilizamos promise porque también vamos a consultar el número de propiedades para pasarlo en el render y saber cuántas páginas tenemos que pintar. Nos ahorramos 1 await.
        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [ //Incluimos el modelo de categoria y precio para poder extraer datos cruzados entre tablas, lo que sería un join en sql. //Incluimos también el modelo de mensajes.
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes' }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ]);

        res.render('propiedades/admin', {//Le pasamos a la vista el título de la página y las propiedades del usuario
            pagina: 'Mis Propiedades',
            csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
            propiedades,
            usuario: id,
            paginas: Math.ceil(total / limit), //Para devolver el número de botones necesario redondeado hacia arriba.
            paginaActual: Number(paginaActual), //Le pasamos también la página actual para poder resaltarla en la paginación convertida a número.
            total, //Pasamos el total de registros
            limit,
            offset
        });
    } catch (error) {
        console.log(error);
    }

}


//Formulario para crear una nueva propiedad
const crear = async (req, res) => {
    //Extraemos el id del usuario que se pasa desde el middleware protegerRuta.js, que a su vez lo extrae del JWT almacenado en una cookie. Se lo enviamos a la vista para que muestre el header de usuario logado.
    const { id } = req.usuario;

    // Consultar modelo de Precio y Categorías para pasar valores a los select del formulario.
    // Para ejecutarlo de manera simultánea utilizamos Promise.all y nos ahorramos dos await, donde uno se bloquea hasta que termine el otro.
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);



    // Le pasamos al render las consultas obtenidas de categorias y precios para pasárselo a la vista pug.
    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        categorias: categorias,
        precios: precios,
        usuario: id,
        datos: {} //Le pasamos datos aunque sea un objeto vacío, para que no dé error en la primera carga, luego ya cuando se intente crear y hay errores le pasaremos los datos que hay ido introduciendo.
    });
}

//Función de validación para guardar los datos del formulario de crear
const guardar = async (req, res) => {
    //Extraemos el id del usuario que se pasa desde el middleware protegerRuta.js, que a su vez lo extrae del JWT almacenado en una cookie. Se lo enviamos a la vista para que muestre el header de usuario logado.
    const { id } = req.usuario;

    // Validación. La hacemos desde el routing en este caso, y aquí le pasamos el request.
    let resultado = validationResult(req);

    // Si hay errores, devolvemos al formulario con los errores y los datos del formulario.
    if (!resultado.isEmpty()) {
        // Consultar modelo de Precio y Categorías para pasar valores a los select del formulario.
        // Para ejecutarlo de manera simultánea utilizamos Promise.all y nos ahorramos dos await, donde uno se bloquea hasta que termine el otro.
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);
        //Le pasamos si estaba seleccionada una vivienda
        let viviendaSeleccionada = "";
        req.body.validationVivienda == 'yes' ? viviendaSeleccionada = true : viviendaSeleccionada = false;

        // Le pasamos al render las consultas obtenidas de categorias y precios para pasárselo a la vista pug.
        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            categorias: categorias,
            precios: precios,
            csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
            //Le pasamos también las respuestas que se hayan enviado para evitar tener que volver a incluirlas en el formulario
            datos: req.body,
            errores: resultado.array(),
            viviendaSeleccionada,
            usuario: id
        });
    }

    //Si no hay errores, creamos el registro en base de datos.
    //Guardamos las respuestas de los campos del body.
    const { titulo, descripcion, metros, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;

    //Guardamos el id del usuario que nos llega en el request (creado en protegerRuta.js)
    const { id: usuarioId } = req.usuario;

    try {
        const propiedadGuardada = await Propiedad.create({//Creamos el registro con el nombre de los campos de la tabla de bbdd. Si el nombre del campo es igual al de la variable, no hace falta poner dos puntos.
            titulo,
            descripcion,
            metros,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            imagen: '',
            precioId,
            usuarioId, //El usuario lo rescatamos por medio de la cookie creada en el controller de usuario donde almacenábamos un json web token con la información del usuario. Esto lo hacemos en /middleware/protegerRuta.js
            categoriaId
        });

        //Rescatamos el id de la propiedad que acabamos de crear y que hemos almacenado en propiedadGuardada
        const { id } = propiedadGuardada;
        //Con todo, redirigimos a la pantalla para agregar la imagen de la propiedad y le pasamos como parámetro el id del anuncio creado.
        res.redirect(`/propiedades/agregar-imagen/${id}`);

    } catch (error) {
        console.log(error);
    }
}

const agregarImagen = async (req, res) => {
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad no esté ya publicada, que sea igual a 1 o true que es lo mismo.
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad pertenece al usuario que visita la página. Tenemos el id del usuario de la propiedad y del que está logado que se pasa en el request a través del middleware protegerRuta.
    if (req.usuario.id.toString() != propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }


    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: "${propiedad.titulo}"`,
        usuario: id,
        csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        propiedad //Le pasamos también la propiedad de la base de datos consultada.
    });
}

const almacenarImagen = async (req, res, next) => {
    //Leemos el id que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad no esté ya publicada, que sea igual a 1 o true que es lo mismo.
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad pertenece al usuario que visita la página. Tenemos el id del usuario de la propiedad y del que está logado que se pasa en el request a través del middleware protegerRuta.
    if (req.usuario.id.toString() != propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    let files = [];

    req.files.forEach(element => {
        files.push(element.filename);
    });

    try {
        //Almacenar la imagen y publicar propiedad
        //console.log(req.file);
        propiedad.imagen = files.toString(); //En req.file se almacenan los datos de la imagen. Podemos ver la información y los campos con un console.log
        propiedad.publicado = 1;

        await propiedad.save(); //Para almacenar los dos cambios anteriores en base de datos.

        //En este caso no podemos redirigir a mis propiedades desde aquí, lo hacemos desde java script, desde el objeto dropzone en agregarImagen.js

        next(); //Para que vaya al siguiente middleware.
    } catch (error) {
        console.log(error);
    }
}

const editar = async (req, res) => { //Nos vale parte del código de la función crear
    //Extraemos el id del usuario que se pasa desde el middleware protegerRuta.js, que a su vez lo extrae del JWT almacenado en una cookie. Se lo enviamos a la vista para que muestre el header de usuario logado.
    const { id: id_user } = req.usuario;

    //Validaciones para asegurar el end point.
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id); //Extraemos os datos de la propiedad pasada como parámetro en la url.
    if (!propiedad) {//Si no existe redirigimos a mis-propiedades
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad pertenece al usuario que visita la página. Tenemos el id del usuario de la propiedad y del que está logado que se pasa en el request a través del middleware protegerRuta.
    if (req.usuario.id.toString() != propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    // Consultar modelo de Precio y Categorías para pasar valores a los select del formulario.
    // Para ejecutarlo de manera simultánea utilizamos Promise.all y nos ahorramos dos await, donde uno se bloquea hasta que termine el otro.
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    //Indicamos si tiene que habilitar el contenedor de selectores de vivienda
    let viviendaSeleccionada = "";
    propiedad.categoriaId == '1' || propiedad.categoriaId == '2' || propiedad.categoriaId == '3' ? viviendaSeleccionada = true : viviendaSeleccionada = false;

    console.log(id_user);

    // Le pasamos al render las consultas obtenidas de categorias y precios para pasárselo a la vista pug.
    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
        categorias,
        precios,
        usuario: id_user,
        datos: propiedad,
        viviendaSeleccionada
    });
}

const guardarCambios = async (req, res) => {
    // Validación formulario. La hacemos desde el routing en este caso, y aquí le pasamos el request.
    let resultado = validationResult(req);

    // Si hay errores, devolvemos al formulario con los errores y los datos del formulario.
    if (!resultado.isEmpty()) {
        const { id: id_user } = req.usuario;
        // Consultar modelo de Precio y Categorías para pasar valores a los select del formulario.
        // Para ejecutarlo de manera simultánea utilizamos Promise.all y nos ahorramos dos await, donde uno se bloquea hasta que termine el otro.
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);
        // Le pasamos al render las consultas obtenidas de categorias y precios para pasárselo a la vista pug.
        return res.render('propiedades/editar', {
            pagina: "Editar Propiedad",
            categorias,
            precios,
            csrfToken: req.csrfToken(), //Con esta variable le pasamos el token público para validarse con el privado y evitar CSRF
            //Le pasamos también las respuestas que se hayan enviado para evitar tener que volver a incluirlas en el formulario
            datos: req.body,
            errores: resultado.array(),
            usuario: id_user
        });
    }

    //Validaciones para asegurar el end point si todo ha ido bien.
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id); //Extraemos os datos de la propiedad pasada como parámetro en la url.
    if (!propiedad) {//Si no existe redirigimos a mis-propiedades
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad pertenece al usuario que visita la página. Tenemos el id del usuario de la propiedad y del que está logado que se pasa en el request a través del middleware protegerRuta.
    if (req.usuario.id.toString() != propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    //Si las validaciones del formulario y del endpoint han ido bien, reescribimos el objeto y guardamos
    try {
        //Guardamos las respuestas de los campos del body.
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;
        //Seteamos la propiedad
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        });
        //Guardamos
        await propiedad.save();

        res.redirect('/mis-propiedades');

    } catch (error) {
        console.log(error);
    }
}

const eliminar = async (req, res) => {
    //Validaciones para asegurar el end point si todo ha ido bien.
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id); //Extraemos os datos de la propiedad pasada como parámetro en la url.
    if (!propiedad) {//Si no existe redirigimos a mis-propiedades
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad pertenece al usuario que visita la página. Tenemos el id del usuario de la propiedad y del que está logado que se pasa en el request a través del middleware protegerRuta.
    if (req.usuario.id.toString() != propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    const imagenes = propiedad.imagen.split(',');
    console.log(imagenes);
    if (imagenes) {
        imagenes.forEach(async imagen => {
            //Eliminar la imagen asociada con la funcionalidad unlink de node
            await unlink(`./public/uploads/${imagen}`);
        });
    }

    //Eliminar la propiedad
    await propiedad.destroy();

    //Redirigimos de nuevo a mis-propiedades
    res.redirect('/mis-propiedades');
}

// Modifica el estado de una propiedad
const cambiarEstado = async (req, res) => {
    //Validaciones para asegurar el end point si todo ha ido bien.
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id); //Extraemos os datos de la propiedad pasada como parámetro en la url.
    if (!propiedad) {//Si no existe redirigimos a mis-propiedades
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad pertenece al usuario que visita la página. Tenemos el id del usuario de la propiedad y del que está logado que se pasa en el request a través del middleware protegerRuta.
    if (req.usuario.id.toString() != propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    //Actualizamos la propiedad
    propiedad.publicado = !propiedad.publicado; //Esto lo que hace es cambiar el valor a propiedad.publicado, si es 0 le pasa 1 y si es 1 le pasa 0. Es más corto que utilizando un if-else.

    await propiedad.save();

    //Como esta función es tipo API, le devolvemos un json
    res.json({
        resultado: true
    });
}

// Muestra una propiedad
const mostrarPropiedad = async (req, res) => {
    //Validaciones para asegurar el end point si todo ha ido bien.
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(
        id,
        {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Precio, as: 'precio' }
            ]
        }
    ); //Extraemos os datos de la propiedad pasada como parámetro en la url. //Incluimos el modelo de categoria y precio para poder extraer datos cruzados entre tablas, lo que sería un join en sql.

    if (!propiedad) {//Si no existe redirigimos a página de error 404 que crearemos
        return res.redirect('/404');
    }

    //Controlamos si es una vivienda o no
    let vivienda;
    propiedad.categoriaId == "1" || propiedad.categoriaId == "2" || propiedad.categoriaId == "3" ? vivienda = true : vivienda = false;

    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        propiedad,
        csrfToken: req.csrfToken(),
        usuario: req.usuario, //Le pasamos a la vista el usuario identificado en el middleware para comprobar si la persona que está accediendo tiene usuari y está logada.
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId), //Ponemos la interrogación para que el id del request si existe el usuarios en el request y si no, que no dé error. Si el id del usuario conectado es diferente al que publicó la propiedad, devolverá false, si es el mismo true.
        vivienda
    });
}

const enviarMensaje = async (req, res) => {
    //Validaciones para asegurar el end point si todo ha ido bien.
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(
        id,
        {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Precio, as: 'precio' },
                { model: Usuario.scope('eliminarPassword'), as: 'usuario' }
            ]
        }
    ); //Extraemos os datos de la propiedad pasada como parámetro en la url. //Incluimos el modelo de categoria y precio para poder extraer datos cruzados entre tablas, lo que sería un join en sql.

    if (!propiedad) {//Si no existe redirigimos a página de error 404 que crearemos
        return res.redirect('/404');
    }

    // Renderizar los errores en caso de tenerlos
    // Validación. La hacemos desde el routing en este caso, y aquí le pasamos el request.
    let resultado = validationResult(req);

    // Si hay errores, devolvemos al formulario con los errores y los datos del formulario.
    if (!resultado.isEmpty()) {
        return res.render('propiedades/mostrar', {
            pagina: propiedad.titulo,
            propiedad,
            csrfToken: req.csrfToken(),
            usuario: req.usuario, //Le pasamos a la vista el usuario identificado en el middleware para comprobar si la persona que está accediendo tiene usuari y está logada.
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId), //Ponemos la interrogación para que el id del request si existe el usuarios en el request y si no, que no dé error. Si el id del usuario conectado es diferente al que publicó la propiedad, devolverá false, si es el mismo true.
            errores: resultado.array() //Le pasamos los errores
        })
    }

    //Si no hay errores...
    //Almacenar mensaje, quién lo envía y la propiedad a la que se dirige
    const { mensaje } = req.body;
    const { id: usuarioId } = req.usuario; //Lo renombramos porque en esta función ya tenemos una constante declarada como id para la propiedad.


    await Mensaje.create({
        mensaje,
        propiedadId: id,
        usuarioId
    });

    // Envía email de contacto
    emailContacto({
        nombre: propiedad.usuario.nombre,
        email: propiedad.usuario.email,
        titulo: propiedad.titulo
    })

    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        propiedad,
        csrfToken: req.csrfToken(),
        usuario: req.usuario, //Le pasamos a la vista el usuario identificado en el middleware para comprobar si la persona que está accediendo tiene usuari y está logada.
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId), //Ponemos la interrogación para que el id del request si existe el usuarios en el request y si no, que no dé error. Si el id del usuario conectado es diferente al que publicó la propiedad, devolverá false, si es el mismo true.
        enviado: true
    });
}

//Leer mensajes recibidos
const verMensajes = async (req, res) => {
    //Validaciones para asegurar el end point si todo ha ido bien.
    //Leemos el id de la propiedad que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Mensaje, as: 'mensajes',
                include: [
                    { model: Usuario.scope('eliminarPassword'), as: 'usuario' } //Relacionamos Mensaje con Usuario para poder estraer el nombre del usuario. Le pasamos el scope para no traernos información no necesaria.
                ]
            }
        ]
    }); //Extraemos os datos de la propiedad pasada como parámetro en la url.
    if (!propiedad) {//Si no existe redirigimos a mis-propiedades
        return res.redirect('/mis-propiedades');
    }

    //Validar que la propiedad pertenece al usuario que visita la página. Tenemos el id del usuario de la propiedad y del que está logado que se pasa en el request a través del middleware protegerRuta.
    if (req.usuario.id.toString() != propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        usuario: propiedad.usuarioId,
        csrfToken: req.csrfToken(),
        formatearFecha
    })
}

const eliminarMensaje = async (req, res) => {
    //Validaciones para asegurar el end point si todo ha ido bien.
    //Leemos el id del mensaje que nos llega como parámetro
    const { id } = req.params;

    //Validar que la propiedad exista
    const mensaje = await Mensaje.findByPk(id); //Extraemos os datos de la propiedad pasada como parámetro en la url.
    if (!mensaje) {//Si no existe redirigimos a mis-propiedades
        return res.redirect('/mis-propiedades');
    }

    //Nos quedamos con la propiedad de la que estábamos viendo los mensajes para volver a enviar a esa misma vista.
    const idPropiedad = mensaje.propiedadId;

    //Eliminar el mensaje
    await mensaje.destroy();

    //Volvemos a extraer los mensaje de esa propiedad
    const propiedad = await Propiedad.findByPk(idPropiedad, {
        include: [
            {
                model: Mensaje, as: 'mensajes',
                include: [
                    { model: Usuario.scope('eliminarPassword'), as: 'usuario' } //Relacionamos Mensaje con Usuario para poder estraer el nombre del usuario. Le pasamos el scope para no traernos información no necesaria.
                ]
            }
        ]
    });

    //Redirigimos de nuevo a mensajes
    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        usuario: propiedad.usuarioId,
        csrfToken: req.csrfToken(),
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes,
    eliminarMensaje
}