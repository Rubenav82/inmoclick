// Código que se requiere para crear un mapa. Está en la documentación de leaflet
(function () {
    const lat = 41.6517662; //Ubicación de inicio del mapa.
    const lng = -4.7299581; //Ubicación de inicio del mapa.
    const mapa = L.map('mapa-inicio').setView([lat, lng], 12);

    //Creamos el grupo de markers
    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Dibujamos el mapa
    const mostrarPropiedades = propiedades => {
        //Primero pintar los markers previos, por si filtramos en la vista que se borren los que ya estaban antes de pintar los filtrados.


        propiedades.forEach(propiedad => {//propiedades es un array, así que lo recorremos con un forEach
            //Agregar los pines al mapa
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], { //Es buena práctica cuando consultamos una API el poner la ?, con eso lo que hacemos es que si no hay propiedad no pone nada.
                autoPan: true
            })
                .addTo(mapa)
                .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
                <h1 class="font-bold uppercase my-2 text-center">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen.split(',')[0]}" alt="Imagen de la Propiedad ${propiedad?.titulo}" title="Imagen de la Propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
                <a href="/propiedad/${propiedad?.id}" class="bg-indigo-600 block p-2 text-center font-bold rounded shadow hover:bg-indigo-700" style="color: white">Ver Propiedad</a>
            `);  //Añadimos información al popup del pin si le pinchamos

            markers.addLayer(marker);//Nos va a pemitir limpiar los pines que no coinciden con la búsqueda realizada en el buscador de la vista.
        })
    }

    //Consultamos la API que hemos creado para pintar en el mapa los pines de todas las propiedades
    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'; //url de la api
            const respuesta = await fetch(url); //Consulta a la url para ver si la respuesta es correcta
            propiedades = await respuesta.json();

            mostrarPropiedades(propiedades); //Se llama a la función pasando las propiedades como parámetro.

        } catch (error) {
            console.log(error);
        }
    }

    
    //Llamamos a la función obtenerPropiedades por defecto al cargar la página para que de primeras se pinte el mapa con todos los pines.
    obtenerPropiedades();

    //Filtros del buscador de la vista
    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    const filtros = {
        categoria: '',
        precio: ''
    }

    //Filtrado de categorías y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = parseInt(e.target.value); //Por defecto nos devuelve un string, lo pasamos a número
        filtrarPropiedades();
    }); //El evento change es para cuando hay cambios en un select

    preciosSelect.addEventListener('change', e => {
        filtros.precio = parseInt(e.target.value);
        filtrarPropiedades();
    });

    //Función para filtrar por las propiedades en función de los buscadores de la vista
    const filtrarPropiedades = () => {
        const resultado = propiedades
            .filter(filtrarCategoria)
            .filter(filtrarPrecio);//Filter itera en cada una de las propiedades para filtrarlas.
        markers.clearLayers(); //Limpiamos los markers que ya estaban.
        mostrarPropiedades(resultado); //Llamamos a la función mostrar propiedades con el resultado de las propiedades filtradas.
    }
    const filtrarCategoria = (propiedad) => {
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad; //Si hay algo seleccionado en el select de categoria, retorna las propiedades en las que la categoriaId sea igual a la categoría seleccionada en el filtro. Si filtros.categoria está vacío, pintado todo.
    }
    const filtrarPrecio = (propiedad) => {
        return filtros.precio ? propiedad.precioId === filtros.precio : propiedad;
    }

})();