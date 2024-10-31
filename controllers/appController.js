import Sequelize from 'sequelize';
import { Precio, Categoria, Propiedad } from '../models/index.js';

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

    //Enviamos el usuario identificado del middleware identificarUsuario.js para personalizar el menú de navegación 

    res.render('./app/inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        pisos,
        casas,
        csrfToken: req.csrfToken(),
        usuario: req.usuario
    });
}

// Categorías
const categoria = async (req, res) => {
    const { id } = req.params; //Extraemos el id de la categoría que se está consultando y que se pasa como parámetro

    // Verificar que la categoría existe
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
        return res.redirect('/404'); //Si la categoría no existe retornamos a página 404
    }

    // Consultar las propiedades de esa categoría
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id,
            publicado: 1
        },
        include: [
            { model: Precio, as: 'precio' }
        ]
    });

    //Identificamos si es vivienda o no
    let vivienda;
    categoria.id == "1" || categoria.id == "2" || categoria.id == "3" ? vivienda = true : vivienda = false;

    res.render('app/categoria', {
        pagina: `${categoria.nombre != 'Local' ? categoria.nombre + 's' : categoria.nombre + 'es'} en Venta`,
        propiedades,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        vivienda
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
        usuario: req.usuario
    })
}

export {
    inicio,
    categoria,
    notFound,
    buscador
}