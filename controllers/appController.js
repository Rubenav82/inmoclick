import Sequelize from 'sequelize';
import { Precio, Categoria, Propiedad } from '../models/index.js';
import { formatearFecha } from '../helpers/index.js';

// Página de inicio
const inicio = async (req, res) => {
    //Consultamos categorías y precios para los buscadores de la vista y cada uno de los tipos de propiedades para representar las últimas creadas en la vista.
    const [categorias, precios, pisos, casas] = await Promise.all([
        Categoria.findAll({ raw: true }), //Utilizamos raw para traernos la información más limpia. Se puede ver con un console.log
        Precio.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1,
                publicado: 1
            },
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' }
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 3,
                publicado: 1
            },
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' }
            ],
            order: [['createdAt', 'DESC']]
        })
    ]);

    //Identificamos si es vivienda o no. En este caso como lo único que vamos a pasar son pisos y casas, todas son viviendas.
    let vivienda = true;

    //Enviamos el usuario identificado del middleware identificarUsuario.js para personalizar el menú de navegación 

    res.render('./app/inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        pisos,
        casas,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        vivienda,
        formatearFecha
    });
}

// Categorías
const categoria = async (req, res) => {
    // Leer QueryString, para leer de la url la página que se está visualizando de la tabla paginada. En este caso no se pasa como parámetro en el routing, si no como query en la url
    const { pagina: paginaActual } = req.query; //Leemos el parámetro con query y le renombramos a paginaActual para no confundir con el parámetro pagina que pasamos en el render de la vista.

    // Límites y Offset para el paginador
    const limit = 6; //Límite de registros a mostrar en cada página
    const offset = ((paginaActual * limit) - limit); //Para saber el número de registros que nos tenemos que saltar

    const { id } = req.params; //Extraemos el id de la categoría que se está consultando y que se pasa como parámetro

    // Verificar que la categoría existe
    const categoria = await Categoria.findByPk(id);

    console.log("El id de la categoría es: " + id)

    if (!categoria) {
        return res.redirect('/404'); //Si la categoría no existe retornamos a página 404
    }


    // Consultar las propiedades de esa categoría
    const propiedades = await Propiedad.findAll({
        limit,
        offset,
        where: {
            categoriaId: id,
            publicado: 1
        },
        order: [['createdAt', 'DESC']],
        include: [
            { model: Precio, as: 'precio' }
        ]
    });

    const total = await Propiedad.count({
        where: {
            categoriaId: id,
            publicado: 1
        }
    })

    //Identificamos si es vivienda o no
    let vivienda;
    categoria.id == "1" || categoria.id == "2" || categoria.id == "3" ? vivienda = true : vivienda = false;

    res.render('app/categoria', {
        pagina: `${categoria.nombre != 'Local' ? categoria.nombre + 's' : categoria.nombre + 'es'} en Venta`,
        propiedades,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        vivienda,
        paginas: Math.ceil(total / limit), //Para devolver el número de botones necesario redondeado hacia arriba.
        paginaActual: Number(paginaActual), //Le pasamos también la página actual para poder resaltarla en la paginación convertida a número.
        total, //Pasamos el total de registros,
        limit,
        offset,
        id,
        formatearFecha
    })
}

// Página 404
const notFound = (req, res) => {
    res.render('404', {
        pagina: 'Página No Encontrada',
        csrfToken: req.csrfToken(),
        usuario: req.usuario
    })
}

// Buscador
const buscador = async (req, res) => {
    //Primero leemos lo que nos han pasado en el buscador, en el input con name="termino"
    const { termino } = req.body;

    //Validamos que el input no esté vacío eliminando los espacios
    if (!termino.trim()) {
        return res.redirect('back'); //Si está vacío devolvemos a la misma página
    }

    //Consultamos las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like]: '%' + termino + '%' //Importamos sequelize, y de esta forma buscamos que contenga lo que le pasamos.
            }
        },
        include: [
            { model: Precio, as: 'precio' }
        ]
    });

    res.render('app/busqueda', {
        pagina: 'Resultado de la Búsqueda',
        propiedades,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        formatearFecha
    })
}

export {
    inicio,
    categoria,
    notFound,
    buscador
}