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

/***/ "./src/js/mostrarSelects.js":
/*!**********************************!*\
  !*** ./src/js/mostrarSelects.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Código para mostrar selectores en función del tipo de propiedad a publicar\r\n(function () {\r\n\r\n    //Elemento en el que necesitamos asignar el evento y a los que queremos modificar la clase\r\n    const categoriaSelect = document.querySelector('#categoria');\r\n    const contenedorViviendaSelect = document.querySelector('#viviendas');\r\n    const validationVivienda = document.querySelector('#validationVivienda');\r\n\r\n    //Evento cambio de estado\r\n    categoriaSelect.addEventListener('change', e => {\r\n        const value = parseInt(e.target.value); //Por defecto nos devuelve un string, lo pasamos a número\r\n        // console.log(value);\r\n\r\n        if(value <= 3 && !contenedorViviendaSelect.classList.contains('md:flex')){\r\n            contenedorViviendaSelect.classList.toggle('hidden');\r\n            contenedorViviendaSelect.classList.toggle('md:flex');\r\n            validationVivienda.value = \"yes\";\r\n        } else if(value >3 && contenedorViviendaSelect.classList.contains('md:flex')){\r\n            contenedorViviendaSelect.classList.toggle('hidden');\r\n            contenedorViviendaSelect.classList.toggle('md:flex');\r\n            validationVivienda.value = \"no\";\r\n        }\r\n    }); //El evento change es para cuando hay cambios en un select.\r\n\r\n})();\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mostrarSelects.js?");

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
/******/ 	__webpack_modules__["./src/js/mostrarSelects.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;