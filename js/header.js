/* Código para desplegar el menú de diseño responsive */
function display_menu(){
    /* Solo tenemos una barra de navegación, por ello es la primera que encuentre,
    También mencionar que hacemos el display block para que se muestre
     */
    document.getElementsByTagName('nav')[0].style.left = "0";
}

function close_menu(){
    /* Solo tenemos una barra de navegación */
    document.getElementsByTagName('nav')[0].style.left = "-100%";
}

/* Código para solventar un problema con la barra de navegación cuando se modifica su posición mediante javascript
* y se cambia de mediaquery
* */

var storePreviusNavStyle;

const mediaQueryList = window.matchMedia("(min-width: 890px)");

function manejador(eventoMediaQueryList) {
    if (eventoMediaQueryList.matches) {
        document.getElementsByTagName('nav')[0].style = storePreviusNavStyle;
    } else {
        storePreviusNavStyle = document.getElementsByTagName('nav')[0].style;
    }
}

// Asociamos el manejador de evento
mediaQueryList.addEventListener('change', manejador);

// Remover el event listener cuando ya no sea necesario
// mediaQueryList.removeEventListener('change', manejador);