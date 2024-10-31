import { Precio, Categoria, Propiedad } from '../models/index.js';

const propiedades = async (req, res) => {
    //Consultamos todas las propiedades
    const propiedades = await Propiedad.findAll({
        include: [ //Incluimos el modelo de categoria y precio para poder extraer datos cruzados entre tablas, lo que sería un join en sql.
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ],
        where: {
            publicado: 1
        }
        //limit: 1 Se recomienda limitar cuando son muchos registros
    })

    //Enviamos como respuesta un JSON
    res.json(propiedades);
}

export {
    propiedades
}