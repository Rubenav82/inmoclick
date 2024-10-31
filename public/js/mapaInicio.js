/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Código que se requiere para crear un mapa. Está en la documentación de leaflet\r\n(function () {\r\n    const lat = 41.6517662; //Ubicación de inicio del mapa.\r\n    const lng = -4.7299581; //Ubicación de inicio del mapa.\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 12);\r\n\r\n    //Creamos el grupo de markers\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n\r\n    let propiedades = [];\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    //Dibujamos el mapa\r\n    const mostrarPropiedades = propiedades => {\r\n        //Primero pintar los markers previos, por si filtramos en la vista que se borren los que ya estaban antes de pintar los filtrados.\r\n\r\n\r\n        propiedades.forEach(propiedad => {//propiedades es un array, así que lo recorremos con un forEach\r\n            //Agregar los pines al mapa\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], { //Es buena práctica cuando consultamos una API el poner la ?, con eso lo que hacemos es que si no hay propiedad no pone nada.\r\n                autoPan: true\r\n            })\r\n                .addTo(mapa)\r\n                .bindPopup(`\r\n                <p class=\"text-indigo-600 font-bold\">${propiedad?.categoria.nombre}</p>\r\n                <h1 class=\"font-bold uppercase my-2 text-center\">${propiedad?.titulo}</h1>\r\n                <img src=\"/uploads/${propiedad?.imagen.split(',')[0]}\" alt=\"Imagen de la Propiedad ${propiedad?.titulo}\" title=\"Imagen de la Propiedad ${propiedad?.titulo}\">\r\n                <p class=\"text-gray-600 font-bold\">${propiedad?.precio.nombre}</p>\r\n                <a href=\"/propiedad/${propiedad?.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold rounded shadow hover:bg-indigo-700\" style=\"color: white\">Ver Propiedad</a>\r\n            `);  //Añadimos información al popup del pin si le pinchamos\r\n\r\n            markers.addLayer(marker);//Nos va a pemitir limpiar los pines que no coinciden con la búsqueda realizada en el buscador de la vista.\r\n        })\r\n    }\r\n\r\n    //Consultamos la API que hemos creado para pintar en el mapa los pines de todas las propiedades\r\n    const obtenerPropiedades = async () => {\r\n        try {\r\n            const url = '/api/propiedades'; //url de la api\r\n            const respuesta = await fetch(url); //Consulta a la url para ver si la respuesta es correcta\r\n            propiedades = await respuesta.json();\r\n\r\n            mostrarPropiedades(propiedades); //Se llama a la función pasando las propiedades como parámetro.\r\n\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n    \r\n    //Llamamos a la función obtenerPropiedades por defecto al cargar la página para que de primeras se pinte el mapa con todos los pines.\r\n    obtenerPropiedades();\r\n\r\n    //Filtros del buscador de la vista\r\n    const categoriasSelect = document.querySelector('#categorias');\r\n    const preciosSelect = document.querySelector('#precios');\r\n\r\n    const filtros = {\r\n        categoria: '',\r\n        precio: ''\r\n    }\r\n\r\n    //Filtrado de categorías y precios\r\n    categoriasSelect.addEventListener('change', e => {\r\n        filtros.categoria = parseInt(e.target.value); //Por defecto nos devuelve un string, lo pasamos a número\r\n        filtrarPropiedades();\r\n    }); //El evento change es para cuando hay cambios en un select\r\n\r\n    preciosSelect.addEventListener('change', e => {\r\n        filtros.precio = parseInt(e.target.value);\r\n        filtrarPropiedades();\r\n    });\r\n\r\n    //Función para filtrar por las propiedades en función de los buscadores de la vista\r\n    const filtrarPropiedades = () => {\r\n        const resultado = propiedades\r\n            .filter(filtrarCategoria)\r\n            .filter(filtrarPrecio);//Filter itera en cada una de las propiedades para filtrarlas.\r\n        markers.clearLayers(); //Limpiamos los markers que ya estaban.\r\n        mostrarPropiedades(resultado); //Llamamos a la función mostrar propiedades con el resultado de las propiedades filtradas.\r\n    }\r\n    const filtrarCategoria = (propiedad) => {\r\n        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad; //Si hay algo seleccionado en el select de categoria, retorna las propiedades en las que la categoriaId sea igual a la categoría seleccionada en el filtro. Si filtros.categoria está vacío, pintado todo.\r\n    }\r\n    const filtrarPrecio = (propiedad) => {\r\n        return filtros.precio ? propiedad.precioId === filtros.precio : propiedad;\r\n    }\r\n\r\n})();\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;