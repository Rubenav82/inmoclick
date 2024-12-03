import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = { // El punto imagen es para indicarle que objeto Dropzone es al que estamos modificando las opciones. Que es el id del formulario de la vista.
    dictDefaultMessage: 'Arrastra aquí un máximo de 4 imágenes en formato PNG, JPG o JPEG',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 8,
    uploadMultiple: true,
    maxFiles: 4,
    parallelUploads: 4, //Misma cantidad que número máximo de archivos a subir.
    autoProcessQueue: false, //Esto lo que hace es que la foto no se suba hasta que se pulse el boton de subir.
    addRemoveLinks: true, //Para poder eliminar imágenes que se han añadido a Dropzone y que queramos no subir.
    dictRemoveFile: 'Eliminar imagen',
    dictMaxFilesExceeded: 'El límite son 4 imagenes',
    headers: { //para pasarle el csrf-token en este caso en el header
        'CSRF-Token': token
    },
    paramName: 'imagen', //Nombre de parámetro del dropzone, para indicarlo en el router.
    init: function () {//Este init con la function, nos va a permitir reescribir el objeto de DropZone, para poder cargar la imagen cuando se pulse el botón y no en automático. Aquí tener en cuenta que el botón de submit va por fuera del formulario dropzone.
        const dropzone = this;
        const bntPublicar = document.querySelector('#publicar'); //Guardamos en una variable el botón.

        console.log('Inicializando Dropzone...'); 
        console.log('Botón Publicar encontrado:');

        bntPublicar.addEventListener('click', function () {//Capturamos el evento.
            console.log('Botón Publicar clickeado');
            dropzone.processQueue();//Método para procesar los archivos.

            dropzone.on('queuecomplete', function(){//Cuando se complete la carga...
                if(dropzone.getActiveFiles().length == 0){//Si no quedan archivos por procesar
                    console.log('Todos los archivos procesados');
                    window.location.href = '/mis-propiedades'; //Redirigimos a mis propiedades.
                }
            });
        });

    }
}