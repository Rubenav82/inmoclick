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

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Código que se requiere para crear un mapa. Está en la documentación de leaflet\r\n(function() {\r\n    const lat = document.querySelector(\"#lat\").value ? document.querySelector(\"#lat\").value : 41.6517662; //Ubicación de inicio del mapa, si ya hay algo marcado, si ya contiene algo ese campo del formulario o la latitud por defecto.\r\n    const lng = document.querySelector(\"#lng\").value ? document.querySelector(\"#lng\").value : -4.7299581; //Ubicación de inicio del mapa, si ya hay algo marcado, si ya contiene algo ese campo del formulario o la longitud por defecto.\r\n    const mapa = L.map('mapa').setView([lat, lng ], 12);\r\n    let marker;\r\n\r\n    // Utilizar Provider y Geocoder\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n    \r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    // Colocamos el pin y le pasamos un objeto con su configuración, para que se pueda mover y para que una vez movido se centre el mapa automáticamente.\r\n    marker = new L.marker([lat,lng],{\r\n        draggable: true,\r\n        autoPan: true\r\n    }).addTo(mapa);\r\n\r\n    // Detectar el movimiento del pin para leer su latitud y longitud\r\n    marker.on('moveend', function(evento){\r\n        marker = evento.target;\r\n        const posicion = marker.getLatLng();\r\n\r\n        // Centramos el mapa cuando movemos el pin\r\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\r\n\r\n        // Obtener información de las calles al soltar el pin\r\n        geocodeService.reverse().latlng(posicion, 13).run(function(error,resultado){\r\n            console.log(resultado);\r\n\r\n            // Le añadimos al pin un popup con la información de la dirección\r\n            marker.bindPopup(resultado.address.LongLabel);\r\n\r\n            //Llenar los campos\r\n            document.querySelector(\".calle\").textContent = resultado.address.Address ?? '';\r\n            document.querySelector(\"#calle\").value = resultado.address.Address ?? '';\r\n            document.querySelector(\"#lat\").value = resultado.latlng.lat ?? '';\r\n            document.querySelector(\"#lng\").value = resultado.latlng.lng ?? '';\r\n        });\r\n    })\r\n\r\n\r\n})();\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

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
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;