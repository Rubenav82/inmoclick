import { check } from 'express-validator'; //Importamos la función validationResult, que es la que va a leer el resultado de la validación y nos va a decir si hubo o no errores en función de las reglas definidas.

//Función para validar formulario de guardar y editar propiedad
const validarFormPropiedad = async (req, res, next) => {
    // Validación. La hacemos desde el controles porque aplicaremos una validación u otra dependiendo de si es una vivienda o no.
    await check('titulo').notEmpty().withMessage('El Título del Anuncio es Obligatorio').run(req);
    await check('descripcion')
        .notEmpty().withMessage('La Descripción no puede estar vacía')
        .isLength({ max: 200 }).withMessage('La Descripción es muy larga')
        .run(req);
    await check('metros').notEmpty().withMessage('Los metros deben ser un número entero').run(req);
    await check('categoria').isNumeric().withMessage('Selecciona una categoría').run(req); //- Los ids son numéricos, si no es numérica la categoría es que no se ha seleccionado.
    await check('precio').isNumeric().withMessage('Selecciona un rango de precios').run(req);
    await check('calle').notEmpty().withMessage('Ubica la Propiedad en el Mapa').run(req);

    //Si es una vivienda, además validamos:
    if (req.body.validationVivienda == "yes") {
        await check('habitaciones').isNumeric().withMessage('Selecciona un número de habitaciones').run(req);
        await check('estacionamiento').isNumeric().withMessage('Selecciona un número de estacionamientos').run(req);
        await check('wc').isNumeric().withMessage('Selecciona un número de baños').run(req);
    }

    next(); //Pasamos al siguiente middleware
}

const validarFormRegistro = async (req, res, next) => {
    // Validación
    await check('nombre').trim().notEmpty().withMessage('El nombre no puede ir vacío.').run(req); //Validar que el nombre no está vacío (estas funciones nos las da express-validator). Le pasamos el run para que ejecute la función con los valores recibidos.
    await check('email').isEmail().withMessage('El email no es válido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres.').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales.').run(req);

    next();
}

const validarFormLogin = async (req, res, next) => {
        // Validación
        await check('email').isEmail().withMessage('El email es obligatorio').run(req); //Validar que el nombre no está vacío (estas funciones nos las da express-validator). Le pasamos el run para que ejecute la función con los valores recibidos.
        await check('password').notEmpty().withMessage('El password es obligatorio.').run(req);

        next();
}

const validarFormResetPassword = async (req, res, next) => {
    // Validación
    await check('email').isEmail().withMessage('El email no es válido').run(req);

    next();
}

const validarFormNewPassword = async (req, res, next) => {
        // Validación
        await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres.').run(req);

        next();
}

export {
    validarFormPropiedad,
    validarFormRegistro,
    validarFormLogin,
    validarFormResetPassword,
    validarFormNewPassword
}