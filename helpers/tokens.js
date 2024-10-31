import jwt from 'jsonwebtoken';

//Para gener Jsonwebtoken. Le pasamos el id del usuario.
//Instalamos la dependencia jsonwebtoken para autenticación de usuarios. Una de las más usada en node. Le pasamos como parámetros la información que debe de ir en el token, y si utilizamos un privatekey o una palabra secreta. Después de la palabra secreta le pasamos las opciones en otro objeto. Le ponemos que expira el token en un día.
//Se recomienda no almacenar información muy sensible en el token, ya que se puede descifrar.
const generarJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Parar generar tokens sin instalar dependencias extras
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarJWT,
    generarId
}