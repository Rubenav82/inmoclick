/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'], //Le indicamos donde están las vistas que van a solicitar el css. Esta línea va a escanear todos los archivos .pug para generar el css solo con las líneas necesarias.
  theme: {
    extend: {},
  },
  plugins: [],
}

