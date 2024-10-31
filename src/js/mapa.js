// Código que se requiere para crear un mapa. Está en la documentación de leaflet
(function() {
    const lat = document.querySelector("#lat").value ? document.querySelector("#lat").value : 41.6517662; //Ubicación de inicio del mapa, si ya hay algo marcado, si ya contiene algo ese campo del formulario o la latitud por defecto.
    const lng = document.querySelector("#lng").value ? document.querySelector("#lng").value : -4.7299581; //Ubicación de inicio del mapa, si ya hay algo marcado, si ya contiene algo ese campo del formulario o la longitud por defecto.
    const mapa = L.map('mapa').setView([lat, lng ], 12);
    let marker;

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Colocamos el pin y le pasamos un objeto con su configuración, para que se pueda mover y para que una vez movido se centre el mapa automáticamente.
    marker = new L.marker([lat,lng],{
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Detectar el movimiento del pin para leer su latitud y longitud
    marker.on('moveend', function(evento){
        marker = evento.target;
        const posicion = marker.getLatLng();

        // Centramos el mapa cuando movemos el pin
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        // Obtener información de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function(error,resultado){
            console.log(resultado);

            // Le añadimos al pin un popup con la información de la dirección
            marker.bindPopup(resultado.address.LongLabel);

            //Llenar los campos
            document.querySelector(".calle").textContent = resultado.address.Address ?? '';
            document.querySelector("#calle").value = resultado.address.Address ?? '';
            document.querySelector("#lat").value = resultado.latlng.lat ?? '';
            document.querySelector("#lng").value = resultado.latlng.lng ?? '';
        });
    })


})();