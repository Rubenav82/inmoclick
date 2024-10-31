import { exit } from 'node:process';
import categorias from "./categorias.js"; //Importamos el seeder de categorias. Ponemos js ya que es un archivo que hemos creado, no una dependencia.
import precios from './precios.js'; //Importamos el seeder de precios. Ponemos js ya que es un archivo que hemos creado, no una dependencia.
import usuarios from './usuario.js'; //Importamos el seeder de usuarios.
import db from "../config/db.js"; // Importamos la instancia para la conexión a bbdd
import { Categoria, Precio, Usuario } from "../models/index.js"; //Importamos el modelo Categoria y Precio ya con las relaciones

//Función para importar datos
const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();

        //Generar columnas
        await db.sync();

        //Insertar datos. 
        //De esta forma bloquea las líneas, hasta que no acaba de insertar la primera no empieza la segunda. Aconsejable si hay dependencias.
        /* await Categoria.bulkCreate(categorias);
           await Precio.bulkCreate(precios);*/
        //De esta forma, con un Promise, lo inserta de forma paralela. Utilizaremos una forma un otra en función de si hay dependencias.
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ]);
        console.log("Datos importados correctamente.");
        exit(); //No le pasamos código o le podemos pasar 0 si la ejecución fue correcta.

    } catch (error) {
        console.log(error);
        exit(1); // Esta es una forma de terminar los procesos. Le pasamos código para identificarlo.
    }

};

//Función para limpiar la base de datos
const eliminarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();

        //Eliminar datos de las tablas.
        await db.sync({ force: true });
        console.log("Datos eliminados correctamente.");
        exit(); //No le pasamos código o le podemos pasar 0 si la ejecución fue correcta.
    } catch (error) {
        console.log(error);
        exit(1); // Esta es una forma de terminar los procesos. Le pasamos código para identificarlo.
    }
};

//Para importar el seeder lo hacemos mediante script en el package.json y consola. Creamos tambien la siguiente condición que valide si el argumento en la posición 2 pasado por comando es igual a -i >> "db:importar": "node ./seed/seeder.js -i"

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}