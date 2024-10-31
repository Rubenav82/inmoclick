import express from "express";
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword } from "../controllers/usuarioController.js";
import { validarFormLogin, validarFormNewPassword, validarFormRegistro, validarFormResetPassword } from "../middleware/validarForms.js"; //Middleware para validar el formulario de registro

const router = express.Router();

// Routing

router.get('/login', formularioLogin); // Cuando visitas una página web se realiza una petición get al servidor, si se llama a la página
//Login, se llama a la función (controlador) importada formularioLogin.
router.post('/login', validarFormLogin, autenticar); // Cuando se hace llamada post al login, desde el formulario, se llama a la función autenticar.

// Cerrar sesión
router.post('/cerrar-sesion', cerrarSesion);

router.get('/registro', formularioRegistro);
//Recibiremos por post datos del formulario de registro en Pug
router.post('/registro', validarFormRegistro, registrar);

//Router para la confirmación del alta en el email. No será una url fija, sino que será dinámica. Le pasamos el token como una variable en la url. Routing dinámico.
router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', validarFormResetPassword, resetPassword);

//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', validarFormNewPassword, nuevoPassword);

export default router;