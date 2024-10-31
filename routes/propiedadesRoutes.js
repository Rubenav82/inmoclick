import express from "express";
import { body } from 'express-validator';
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes, eliminarMensaje } from '../controllers/propiedadController.js'; //Importamos las funciones de Controller
import protegerRuta from '../middleware/protegerRuta.js'; //Middleware creado para proteger las rutas.
import upload from "../middleware/subirImagen.js"; //Middleware creado para subir archivos y pasar la configuración a multer.
import identificarUsuario from '../middleware/identificarUsuario.js';
import { validarFormPropiedad } from "../middleware/validarForms.js";

const router = express.Router();

// Routing
router.get('/mis-propiedades', protegerRuta, admin); // Cuando visitas una página web se realiza una petición get al servidor. Se llama a la función admin.

router.get('/propiedades/crear', protegerRuta, crear); // Se llama a la función crear.

router.post('/propiedades/crear',
    protegerRuta,
    validarFormPropiedad,
    guardar
);

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen); //Routing agregando un id

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.any(), //En este caso single porque solo subimos una imagen. Parámetro imagen pasado en agregarImagen.js
    almacenarImagen
);

router.get('/propiedades/editar/:id', //Routing agregando el id la propiedad para confirmar que corresponde al usuario logado.
    protegerRuta,
    editar
);

router.post('/propiedades/editar/:id',
    protegerRuta,
    validarFormPropiedad,
    guardarCambios
);

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
);

router.put('/propiedades/:id', //Para modificar un registro put o patch
    protegerRuta,
    cambiarEstado
);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Área Pública XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
);

// Almacenar los mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({ min: 20 }).withMessage('El mensaje no puede ir vacío o es muy corto'),
    enviarMensaje
);

// Ver mensajes
router.get('/mensajes/:id', 
    protegerRuta,
    verMensajes
)

// Eliminar mensajes
router.post('/mensajes/eliminar/:id', 
    protegerRuta,
    eliminarMensaje
)


export default router;