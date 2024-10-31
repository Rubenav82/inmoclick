import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

const protegerRuta = async (req, res, next) => {
    //Verificar si hay un token de usuario, para evitar acceder sin haberse logado
    const token = req.session.user;

    if (!token) {//Si el token no existe redirigimos a la pantalla de login.
        return res.redirect('/auth/login');
    }

    //Comprobar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //decodificamos el jwt de la cookie. Le pasamos como parámetro el nombre de la cookie y la palabra secreta que utilizamos para codificarlo.

        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id); //No nos traemos toda la información del usuario porque alguna es sensible o no la necesitamos.

        //Almacenar el usuario al request
        if (usuario) {
            req.usuario = usuario; //Agregamos la información del usuario al request. Nos valdrá para saber qué usuarios publican propiedades.

            return next(); //Con este next, lo que hacemos es que si entra en este middleware y todo va bien, le mandamos luego al siguiente.
        } else {//En caso de que el usuario no exista
            return res.redirect('/auth/login');
        }
    } catch (error) {//En caso de error en la comprobación del token, limpiamos la cookie y redirigimos a login
        return res.redirect('/auth/login');
    }
};

export default protegerRuta;