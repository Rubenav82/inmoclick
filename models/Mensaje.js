// Importamos DataTypes de Sequelize
import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js";

// definimos un nuevo modelo con el nombre de la tabla que vamos a crear
const Mensaje = db.define('mensajes', { //mensajes es el nombre de la tabla
    // Aquí es donde vamos a ir definiendo la estructura de esta tabla
    // En este caso no le ponemos ID porque no hay problema en que estos sean numéricos y consecutivos.
    mensaje: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
}); // En la documentación de Sequelize vienen los distintos tipos de datos de esta dependencia

export default Mensaje;