// Importamos DataTypes de Sequelize
import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js";

// definimos un nuevo modelo con el nombre de la tabla que vamos a crear
const Propiedad = db.define('propiedades', {
    // Aquí es donde vamos a ir definiendo la estructura de esta tabla
    id: { // Le ponemos ID especial, para que no sean solo números consecutivos.
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    metros: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calle: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: { //La imagen guardamos la ubicación como texto para que no pese mucho la base de datos
        type: DataTypes.STRING,
        allowNull: false
    },
    publicado: { //Guardamos también si el anuncio ha sido publicado
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}); // En la documentación de Sequelize vienen los distintos tipos de datos de esta dependencia

export default Propiedad;