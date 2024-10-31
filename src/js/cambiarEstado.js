(function () {
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado'); //Puede haber varios elementos con esa clase. No lo hacemos por id porque tendremos varios botones con la misma funcionalidad, uno por cada propiedad.

    cambiarEstadoBotones.forEach(boton => {//Iteramos y a cada botón le añadimos un evento click
        boton.addEventListener('click', cambiarEstadoPropiedad);
    })

    async function cambiarEstadoPropiedad(evento) {//Hacemos la función asíncrona para comunicarnos con el controlador
        const { propiedadId: id } = evento.target.dataset; //dataset te permite acceder a un atributo personalizado

        //XXXXXXXXXXXXX HAY QUE PASARLE EL CSRF TOKEN PORQUE DA ERROR EN CONSOLA XXXXXXXXXXXXX
        // Para ello, como ya se lo estamos pasando desde la vista del controller, lo incluimos en el meta del pug. Y ahora lo leemos
        const token = document.querySelector('meta[name="csrfToken"]').getAttribute('content');

        try {
            const url = `/propiedades/${id}`; // Url del api
            // Enviamos el csrfToken en el request de la petición a la api
            const respuesta = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            });

            //Leemos el resultado del json de la API
            const { resultado } = await respuesta.json();
            //Pero en el navegador hay que ir recargando para ver los cambios, no lo hace en tiempo real.
            if(resultado){ // Si todo salió bien y resultado es true
                if(evento.target.classList.contains('bg-yellow-100')){//Si el botón tiene alguna clase del amarillo le convertimos al verde y viceversa.
                    evento.target.classList.remove('bg-yellow-100', 'text-red-800');
                    evento.target.classList.add('bg-green-100', 'text-green-800');
                    evento.target.textContent = 'Publicado'; //Porque es un button, si fuera input sería value
                } else {
                    evento.target.classList.remove('bg-green-100', 'text-green-800');
                    evento.target.classList.add('bg-yellow-100', 'text-red-800');
                    evento.target.textContent = 'No Publicado'; //Porque es un button, si fuera input sería value
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
})();