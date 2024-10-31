const slider = document.querySelector("#slider");

const childsSlider = [...slider.querySelectorAll("figure")];

let numPagActual = document.querySelector("#paginador");

childsSlider.forEach(function(child, index){
    child.dataset.idSlider = index;
});

addNewActiveElement(childsSlider[0]); //Le asignamos al cargar la página el data active a la primera imagen para que se muestre por defecto

const lengthImages = childsSlider.length;

//Evento para el botón con data-button=next
const nextButton = document.querySelector("[data-button='next']");
nextButton.addEventListener('click', function(event) {
    const currentImage = getCurrentImage(); //Obtengo la imagen actual
    let currentActiveIndex = currentImage.dataset.idSlider; //Obtengo el index que se le ha asignado a esa imagen en el dato idSlider
    currentActiveIndex ++; //Le sumo uno al índice

    if(currentActiveIndex == lengthImages){//Si ya estaba en el último elemento, deberíamos volver a la posición inicial 0
        currentActiveIndex = 0;
    }

    const newActiveElement = childsSlider[currentActiveIndex]; //El nuevo elemento activo será la imagen del array childSlider con la posición resultante

    removeActiveElement();
    addNewActiveElement(newActiveElement); //Le asigno el atributo al nuevo elemneto activo

    numPagActual.innerHTML = (currentActiveIndex+1) + " "; // Modificamos el número de la foto que se está mostrando.
});
//Evento para el botón con data-button=prev
const prevButton = document.querySelector("[data-button='prev']");
prevButton.addEventListener('click', function(event) {
    const currentImage = getCurrentImage(); //Obtengo la imagen actual
    let currentActiveIndex = currentImage.dataset.idSlider; //Obtengo el index que se le ha asignado a esa imagen en el dato idSlider
    currentActiveIndex --; //Le resto uno al índice

    if(currentActiveIndex < 0){//Si ya estaba en el primer elemento, deberíamos volver a la posición final
        currentActiveIndex = lengthImages - 1; //Le restamos uno porque los idSlider comienzan en 0, el id de la última imagen es la logintud del array menos uno
    }

    const newActiveElement = childsSlider[currentActiveIndex]; //El nuevo elemento activo será la imagen del array childSlider con la posición resultante

    removeActiveElement();
    addNewActiveElement(newActiveElement); //Le asigno el atributo al nuevo elemneto activo

    numPagActual.innerHTML = (currentActiveIndex+1) + " "; // Modificamos el número de la foto que se está mostrando.
});


//Obtener el elemento con atributo data active
function getCurrentImage(){
    const currentImage = slider.querySelector("[data-active]");

    return currentImage;
}

//Elimina el atributo del elemento actual con data active
function removeActiveElement(){
    const currentImage = getCurrentImage();
    currentImage.removeAttribute("data-active");
}

//Agregar data active a un elemento
function addNewActiveElement(element){
    element.setAttribute("data-active","");
}



