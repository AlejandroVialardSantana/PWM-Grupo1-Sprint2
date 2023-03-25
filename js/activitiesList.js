document.addEventListener('DOMContentLoaded', init);

const initialActivityContainerHeightInRem = 50;
const offsetActivityContainerHeightInRem = 10;
var actualActivityContainerHeightInRem = 0;

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/filtros.html', 'activities_container_filtros');
    loadTemplate('../views/activityContainer.html', 'activities_container_activity', function() {

        var searchInput = "";
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get('search');
        if (search !== null) {
            searchInput = search;
        }

        // Cargamos las actividades desde el JSON
        //loadActivitiesFromJson('http://localhost:63342/PWM-Grupo1-Sprint2/json/actividades.json', searchInput, 5); para mi webstorm
        loadActivitiesFromJson('../json/actividades.json', searchInput, 5);

        /*
                setDefectActivityContainerHeightValue();
                vaciarContenedorActividades();
                /*mostrarMensajeBusquedaFallida();*/

        /* Agregamos las actividades

        agregarActividad(
            "Actividad 1",
            "Descripción de la actividad 1",
            "https://via.placeholder.com/150x150",
            2,
            "15€"
        );
        */

    });

    // Preparamos los eventos para el boton y el campo de búsqueda
    const searchInput = document.getElementById('activities_search_input');
    const searchButton = document.getElementById('activities_search_button');

    function redirectToActivities() {
        const query = searchInput.value;
        if (query) {
            //window.location.href = `/PWM-Grupo1-Sprint2/activities.html?search=${encodeURIComponent(query)}`; para mi webstorm
            window.location.href = `/activities.html?search=${encodeURIComponent(query)}`;
        }
    }

    searchButton.addEventListener('click', redirectToActivities);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            redirectToActivities();
        }
    });

    //Si ya hemos realizado una búsqueda, establecemos el valor escrito anteriormente en el editbox
    const urlParams = new URLSearchParams(window.location.search);
    const searchParamValue = urlParams.get('search');
    if (searchParamValue !== null) {
        searchInput.value = searchParamValue;
    }

}

function loadActivitiesFromJson(route, searchTerm, maxResults) {
    fetch(route)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let filteredActivities = data.activities.filter(activity => {
                return activity.nombre.toLowerCase().startsWith(searchTerm.toLowerCase());
            });

            //Si no hay actividades que coincidan con el término de búsqueda, mostramos un mensaje de error
            if (filteredActivities.length === 0) {
                mostrarMensajeBusquedaFallida();
                return;
            }

            let addedActivities = 0;
            for (const activity of filteredActivities) {
                if (addedActivities >= maxResults) {
                    break;
                }

                agregarActividad(
                    activity.nombre,
                    activity.descripcion,
                    activity.imagen_url,
                    activity.estrellas,
                    activity.precio
                );
                addedActivities++;
            }
        })
        .catch(error => {
            console.error('Error en la carga de actividades desde JSON:', error);
        });
}


/*
Esta función crea una nueva actividad con los valores pasados por parámetro
 */
function agregarActividad(nombre, descripcion, imagenUrl, numeroEstrellas, precio) {


    const maxEstrellas = 5;
    const contenedor = document.querySelector(".activity_container");

    const box = document.createElement("div");
    box.className = "activity_container_box";

    const imagenContenedor = document.createElement("div");
    imagenContenedor.className = "activity_container_image";
    box.appendChild(imagenContenedor);

    const imagen = document.createElement("img");
    imagen.src = imagenUrl;
    imagen.alt = nombre;
    imagenContenedor.appendChild(imagen);

    const contenidoContenedor = document.createElement("div");
    contenidoContenedor.className = "activity_container_content";
    box.appendChild(contenidoContenedor);

    const contenidoTop = document.createElement("div");
    contenidoTop.className = "activity_container_top";
    contenidoContenedor.appendChild(contenidoTop);

    const titulo = document.createElement("h3");
    titulo.textContent = nombre;
    contenidoTop.appendChild(titulo);

    const limitadorDeAltura = document.createElement("div");
    limitadorDeAltura.id = "max_activity_description_height";
    contenidoTop.appendChild(limitadorDeAltura);

    const textoDescripcion = document.createElement("p");
    textoDescripcion.textContent = descripcion;
    limitadorDeAltura.appendChild(textoDescripcion);

    const contenidoBottom = document.createElement("div");
    contenidoBottom.className = "activity_container_bottom";
    contenidoContenedor.appendChild(contenidoBottom);

    const estrellasContenedor = document.createElement("div");
    estrellasContenedor.className = "five_stars";
    contenidoBottom.appendChild(estrellasContenedor);

    for (let i = 0; i < maxEstrellas; i++) {
        const estrella = document.createElement("i");
        estrella.className = i < numeroEstrellas ? "bi bi-star-fill" : "bi bi-star";
        estrellasContenedor.appendChild(estrella);
    }

    const textoPrecio = document.createElement("span");
    textoPrecio.className = "activity_container_price";
    textoPrecio.textContent = `Precio: ${precio}`;
    contenidoBottom.appendChild(textoPrecio);

    contenedor.appendChild(box);
    /*
    // Para que esto funcione debe haberse añadido al DOM!!
    // Obtenemos el tamaño de 'box' usando 'getBoundingClientRect()'
    const boxSize = box.getBoundingClientRect();

    // Obtenemos el tamaño de fuente base del documento HTML
    const fontSizeBase = parseFloat(getComputedStyle(document.documentElement).fontSize);

    // Convertimos las dimensiones de 'box' de px a rem
    //const boxWidthInRem = boxSize.width / fontSizeBase;
    const boxHeightInRem = boxSize.height / fontSizeBase;

    // Mostramos el tamaño de 'box' en rem en un alert

    //alert(`Tamaño de 'box': {boxWidthInRem}rem, Alto = ${boxHeightInRem}rem`);
    tryAddActivityContainerHeight(boxHeightInRem);
    */
}

function setDefectActivityContainerHeightValue(){
    var activitiesContainer = document.querySelector(".activities_container");
    activitiesContainer.style.height = initialActivityContainerHeightInRem + "rem";

    actualActivityContainerHeightInRem = 0;
}

/* Si el valor que añadimos supera el limite inicial de altura del contenedor de actividades, se añade la altura necesaria para que quepan todas las actividades */
function tryAddActivityContainerHeight(valueToAddInRem){
    const activitiesContainer = document.querySelector(".activities_container");
    const overlayContainer = document.querySelector(".overlay");

    actualActivityContainerHeightInRem += valueToAddInRem;

    if (actualActivityContainerHeightInRem  > (initialActivityContainerHeightInRem - offsetActivityContainerHeightInRem)){
        activitiesContainer.style.height = (actualActivityContainerHeightInRem + offsetActivityContainerHeightInRem)+ "rem";
        overlayContainer.style.height = (actualActivityContainerHeightInRem + offsetActivityContainerHeightInRem - 2)+ "rem";
    }
}

/*
Esta función muestra un mensaje de que no se han encontrado actividades
 */

function mostrarMensajeBusquedaFallida() {
    const mensaje = `
        <div id="activity_search_fail">
            <h2>No se han encontrado actividades para los</h2>
            <h2>parámetros de búsqueda seleccionados..</h2>
            </br></br></br></br></br></br></br></br></br></br></br></br></br></br>
            <h3>Pruebe con otra búsqueda :)</h3>
        </div>`;
    document.querySelector(".activity_container").innerHTML = mensaje;
}

function vaciarContenedorActividades() {
    document.querySelector(".activity_container").innerHTML = "";
}

function loadTemplate(url, id, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) {
                callback();
            }
        });
}