// Importamos DataTypes de Sequelize
import { DataTypes, Sequelize } from "sequelize";
import bcrypt from 'bcrypt';
import db from "../config/db.js";

// definimos un nuevo modelo con el nombre de la tabla que vamos a crear
const Usuario = db.define('usuarios', {
    // Aquí es donde vamos a ir definiendo la estructura de esta tabla
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: { //Para hashear los passwords
        beforeCreate: async function (usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },
    scopes: {//Añadimos scopes para en este caso no traernos toda la información de base de datos cuando lo requiramos, no traernos información sensible como puede ser el password o el token.
        eliminarPassword: {
            attributes: {
                exclude: ['password','token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
}); // En la documentación de Sequelize vienen los distintos tipos de datos de esta dependencia

// Métodos personalizados
// Para comprobar un password hasheado
Usuario.prototype.verificarPassword = function(password) {// Registramos nuestro propio prototype para verificar el password con el hasheado.
    return bcrypt.compareSync(password, this.password);
} 

export default Usuario;