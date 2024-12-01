import express from 'express'; //Dependencias no requieren la extensión.
import csrf from 'csurf'; //Dependencia para proteger el formulario con csrf
import cookieParser from 'cookie-parser'; //Lo requiere csurf para funcionar correctamente
import usuarioRoutes from './routes/usuarioRoutes.js'; //Importamos el routing para usuario.
import propiedadesRoutes from './routes/propiedadesRoutes.js'; //Importamos el routing para propiedades.
import appRoutes from './routes/appRoutes.js'; //Importamos el routing para la app general.
import apiRoutes from './routes/apiRoutes.js'; //Importamos el routing para la API que hemos creado para los pin del mapa.
import db from './config/db.js';
import session from 'express-session';

// Crear la app
const app = express();

//Habilitar lectura de datos de formularios de tipo texto, input... no imágenes
app.use(express.urlencoded({ extended: true }));


//Habilitar cookie-parser para poder escribir en cookies
app.use(cookieParser());

//Sesiones
app.use(session({
    secret: "134hjkh2341234",
    resave: true, //Fuerza que la sesión se guarde nuevamente en el almacén de sesiones incluso si esta no se modificó durante la solicitud.
    saveUninitialized: false, //Fuerza que una sesión que no está inicializada se guarde en la tienda. Una sesión no está inicializada cuando es nueva pero no se ha modificado. Elegir falso es útil para implementar sesiones de inicio de sesión.
    cookie: {
        // maxAge: 1800000 //La cookie expirará en media hora. Cuando el valor maxAge no se establece en la configuración de la cookie, la cookie de sesión se convierte en una cookie de sesión de navegador. Esto significa que la cookie solo existirá mientras la ventana del navegador esté abierta. Una vez que el usuario cierra el navegador, la cookie se eliminará automáticamente.
    }
}))

//Habilitar CSRF
app.use(csrf({ cookie: true }));

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync(); //Para crear las tablas si no existen
    console.log("Conexión Correcta a la Base de datos");
} catch (error) {
    console.log(error);
}

// Habilitar Pug
app.set('view engine', 'pug'); //Configuramos Pug como Template Engines
app.set('views', './views'); //Configuramos el directorio donde guardaremos las vistas para que los renderice y los trate

//Carpeta Pública
app.use(express.static('public')); //Carpeta donde vamos a cargar los archivos estáticos, css, javascript, imágenes...


// Routing
app.use('/auth', usuarioRoutes); //Para usar todas las rutas utilizamos "use". Busca todas la rutas que inicien con /auth
app.use('/', propiedadesRoutes);
app.use('/', appRoutes);
app.use('/api', apiRoutes);//Cuando creas una api se agrega un prefijo de api al inicio, de esa forma será /api/propiedades

// Definir un puerto y arrancar el proyecto

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}.`);
});