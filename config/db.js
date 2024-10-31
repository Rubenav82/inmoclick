import { Sequelize } from "sequelize";
// dotenv para utilizar variables de entorno y que no estén expuestas nuestras variables de conexión por ejemplo en Git
import dotenv from "dotenv";
dotenv.config({path: '.env'});

// Ya ligado a variables de entorno
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '', {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'mysql',
    // define con timestamps para que cree dos columnas a mayores, una con la creación del usuario y otra cuando fue actualizado
    define: {
        timestamps: true
    },
    // pool, este pool de conexiones configura como va a ser el comportamiento para conexiones nuevas o existentes. Lo que va a tratar de hacer Sequelize es mantener o reutilizar las conexiones que estén vivas. En el caso de que haya una conexión viva no se cree una conexión nueva.
    // Máximo de conexiones a mantener serán 5, y mínimo 0 (cuando no haya actividad en el sitio va a cerrar conexiones para liberar recursos).
    // acquire: 30000 milisegundos, 30sg el tiempo que va a pasar tratando de realizar una conexión antes de arrojar un error.
    // idle: 10000 milisegundos, 10sg si ve que no hay nada de movimiento, no hay visitas, etc... le da 10sg para que la conexión se cierre, no se mantenga abierta indefinidamente. 
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // Esto es algo que existía, ya está como obsoleto, por eso lo marcamos como false.
    // operatorsAliases: false Lo quitamos porque salía advertencia de node por deprecado
});

export default db;