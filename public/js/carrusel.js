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

/***/ "./src/js/carrusel.js":
/*!****************************!*\
  !*** ./src/js/carrusel.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst slider = document.querySelector(\"#slider\");\r\n\r\nconst childsSlider = [...slider.querySelectorAll(\"figure\")];\r\n\r\nlet numPagActual = document.querySelector(\"#paginador\");\r\n\r\nchildsSlider.forEach(function(child, index){\r\n    child.dataset.idSlider = index;\r\n});\r\n\r\naddNewActiveElement(childsSlider[0]); //Le asignamos al cargar la página el data active a la primera imagen para que se muestre por defecto\r\n\r\nconst lengthImages = childsSlider.length;\r\n\r\n//Evento para el botón con data-button=next\r\nconst nextButton = document.querySelector(\"[data-button='next']\");\r\nnextButton.addEventListener('click', function(event) {\r\n    const currentImage = getCurrentImage(); //Obtengo la imagen actual\r\n    let currentActiveIndex = currentImage.dataset.idSlider; //Obtengo el index que se le ha asignado a esa imagen en el dato idSlider\r\n    currentActiveIndex ++; //Le sumo uno al índice\r\n\r\n    if(currentActiveIndex == lengthImages){//Si ya estaba en el último elemento, deberíamos volver a la posición inicial 0\r\n        currentActiveIndex = 0;\r\n    }\r\n\r\n    const newActiveElement = childsSlider[currentActiveIndex]; //El nuevo elemento activo será la imagen del array childSlider con la posición resultante\r\n\r\n    removeActiveElement();\r\n    addNewActiveElement(newActiveElement); //Le asigno el atributo al nuevo elemneto activo\r\n\r\n    numPagActual.innerHTML = (currentActiveIndex+1) + \" \"; // Modificamos el número de la foto que se está mostrando.\r\n});\r\n//Evento para el botón con data-button=prev\r\nconst prevButton = document.querySelector(\"[data-button='prev']\");\r\nprevButton.addEventListener('click', function(event) {\r\n    const currentImage = getCurrentImage(); //Obtengo la imagen actual\r\n    let currentActiveIndex = currentImage.dataset.idSlider; //Obtengo el index que se le ha asignado a esa imagen en el dato idSlider\r\n    currentActiveIndex --; //Le resto uno al índice\r\n\r\n    if(currentActiveIndex < 0){//Si ya estaba en el primer elemento, deberíamos volver a la posición final\r\n        currentActiveIndex = lengthImages - 1; //Le restamos uno porque los idSlider comienzan en 0, el id de la última imagen es la logintud del array menos uno\r\n    }\r\n\r\n    const newActiveElement = childsSlider[currentActiveIndex]; //El nuevo elemento activo será la imagen del array childSlider con la posición resultante\r\n\r\n    removeActiveElement();\r\n    addNewActiveElement(newActiveElement); //Le asigno el atributo al nuevo elemneto activo\r\n\r\n    numPagActual.innerHTML = (currentActiveIndex+1) + \" \"; // Modificamos el número de la foto que se está mostrando.\r\n});\r\n\r\n\r\n//Obtener el elemento con atributo data active\r\nfunction getCurrentImage(){\r\n    const currentImage = slider.querySelector(\"[data-active]\");\r\n\r\n    return currentImage;\r\n}\r\n\r\n//Elimina el atributo del elemento actual con data active\r\nfunction removeActiveElement(){\r\n    const currentImage = getCurrentImage();\r\n    currentImage.removeAttribute(\"data-active\");\r\n}\r\n\r\n//Agregar data active a un elemento\r\nfunction addNewActiveElement(element){\r\n    element.setAttribute(\"data-active\",\"\");\r\n}\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/carrusel.js?");

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
/******/ 	__webpack_modules__["./src/js/carrusel.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;