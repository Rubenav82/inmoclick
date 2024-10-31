// Código para mostrar selectores en función del tipo de propiedad a publicar
(function () {

    //Elemento en el que necesitamos asignar el evento y a los que queremos modificar la clase
    const categoriaSelect = document.querySelector('#categoria');
    const contenedorViviendaSelect = document.querySelector('#viviendas');
    const validationVivienda = document.querySelector('#validationVivienda');

    //Evento cambio de estado
    categoriaSelect.addEventListener('change', e => {
        const value = parseInt(e.target.value); //Por defecto nos devuelve un string, lo pasamos a número
        // console.log(value);

        if(value <= 3 && !contenedorViviendaSelect.classList.contains('md:flex')){
            contenedorViviendaSelect.classList.toggle('hidden');
            contenedorViviendaSelect.classList.toggle('md:flex');
            validationVivienda.value = "yes";
        } else if(value >3 && contenedorViviendaSelect.classList.contains('md:flex')){
            contenedorViviendaSelect.classList.toggle('hidden');
            contenedorViviendaSelect.classList.toggle('md:flex');
            validationVivienda.value = "no";
        }
    }); //El evento change es para cuando hay cambios en un select.

})();