//Para comprobar si el usuario que visita una propiedad, es el mismo que la publicó
const esVendedor = (usuarioId, propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId;
}

const formatearFecha = fecha => {
    // const fechaFormateada = new Date(fecha).toISOString().replace("T", " ").slice(0,-5); //Con esto tenemos un formato fecha
    let fechaOriginal = new Date(fecha);
    fechaOriginal.setHours(fechaOriginal.getHours()); //Le sumo 1 horas a la fecha original para que coincida con la fecha de creación.

    const opciones = {//opciones para formatear la fecha
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    const fechaFormateada = fechaOriginal.toLocaleDateString('es-Es', opciones);
    const horaFormateada = fechaOriginal.toLocaleTimeString('es-Es');

    return fechaFormateada + " a las " + horaFormateada+"h";
}

export {
    esVendedor,
    formatearFecha
}