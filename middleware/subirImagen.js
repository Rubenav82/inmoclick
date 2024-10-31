import multer from "multer";
import path from 'path'; //Nos va a retornar la ubicación en el disco duro. Función de nodejs
import { generarId } from "../helpers/tokens.js"; //Para generar un nombre distinto a cada imagen subida.

const storage = multer.diskStorage({
    destination: function (req, file, cb) { //donde se van a guardar los archivos imagen. A la función le pasamos el request, el archivo y un callback.
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {//Al callback se le llama en caso de que se suba el archivo. A la imagen la vamos a denominar con un id único de la función generarId + la extensión, esto último lo extraemos con path.extname.
        cb(null, generarId() + path.extname(file.originalname));
    }
});

const upload = multer({ storage }); //A la variable upload le pasamos la configuración storage de multer.

export default upload;
