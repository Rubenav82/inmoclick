import path from 'path';

export default {
    mode: 'development',
    entry: { //archivo original
        mapa: './src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js',
        mostrarMapa: './src/js/mostrarMapa.js',
        mapaInicio: './src/js/mapaInicio.js',
        cambiarEstado: './src/js/cambiarEstado.js',
        descolapsarMenu: './src/js/descolapsarMenu.js',
        carrusel: './src/js/carrusel.js',
        mostrarSelects: './src/js/mostrarSelects.js'
    },
    output: {
        filename: '[name].js', //nombre con el que se guardará el fichero
        path: path.resolve('public/js') //Directorio en el que se guarda. En este caso tiene que ser ruta absoluta, y para facilitarlo podemos partir de ruta absoluta importando path, y damos solución a que en cada computadora o servidor la ruta absoluta será diferente.
    }
}