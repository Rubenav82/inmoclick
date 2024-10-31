import Categoria from "./Categoria.js";
import Mensaje from "./Mensaje.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js"

Propiedad.belongsTo(Precio, { foreignKey: 'precioId' }); //Una propiedad solo puede tener un precio.
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId' }); //Una propiedad solo pertenece a un usuario.
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId' }); //Una propiedad solo puede corresponder a una categoría.
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId' }); //Una propiedad puede tener varios mensajes. Lo relacionamos con propiedadId
Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId' }); //Un mensaje está referencia a una única propiedad.
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId' }); //Un mensaje está escrito por un único usuario.


export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}