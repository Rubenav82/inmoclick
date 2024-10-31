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

/***/ "./src/js/cambiarEstado.js":
/*!*********************************!*\
  !*** ./src/js/cambiarEstado.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado'); //Puede haber varios elementos con esa clase. No lo hacemos por id porque tendremos varios botones con la misma funcionalidad, uno por cada propiedad.\r\n\r\n    cambiarEstadoBotones.forEach(boton => {//Iteramos y a cada botón le añadimos un evento click\r\n        boton.addEventListener('click', cambiarEstadoPropiedad);\r\n    })\r\n\r\n    async function cambiarEstadoPropiedad(evento) {//Hacemos la función asíncrona para comunicarnos con el controlador\r\n        const { propiedadId: id } = evento.target.dataset; //dataset te permite acceder a un atributo personalizado\r\n\r\n        //XXXXXXXXXXXXX HAY QUE PASARLE EL CSRF TOKEN PORQUE DA ERROR EN CONSOLA XXXXXXXXXXXXX\r\n        // Para ello, como ya se lo estamos pasando desde la vista del controller, lo incluimos en el meta del pug. Y ahora lo leemos\r\n        const token = document.querySelector('meta[name=\"csrfToken\"]').getAttribute('content');\r\n\r\n        try {\r\n            const url = `/propiedades/${id}`; // Url del api\r\n            // Enviamos el csrfToken en el request de la petición a la api\r\n            const respuesta = await fetch(url, {\r\n                method: 'PUT',\r\n                headers: {\r\n                    'CSRF-Token': token\r\n                }\r\n            });\r\n\r\n            //Leemos el resultado del json de la API\r\n            const { resultado } = await respuesta.json();\r\n            //Pero en el navegador hay que ir recargando para ver los cambios, no lo hace en tiempo real.\r\n            if(resultado){ // Si todo salió bien y resultado es true\r\n                if(evento.target.classList.contains('bg-yellow-100')){//Si el botón tiene alguna clase del amarillo le convertimos al verde y viceversa.\r\n                    evento.target.classList.remove('bg-yellow-100', 'text-red-800');\r\n                    evento.target.classList.add('bg-green-100', 'text-green-800');\r\n                    evento.target.textContent = 'Publicado'; //Porque es un button, si fuera input sería value\r\n                } else {\r\n                    evento.target.classList.remove('bg-green-100', 'text-green-800');\r\n                    evento.target.classList.add('bg-yellow-100', 'text-red-800');\r\n                    evento.target.textContent = 'No Publicado'; //Porque es un button, si fuera input sería value\r\n                }\r\n            }\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n})();\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/cambiarEstado.js?");

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
/******/ 	__webpack_modules__["./src/js/cambiarEstado.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;