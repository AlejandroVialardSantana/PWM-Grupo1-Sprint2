document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/searchBar.html', 'home');
    loadTemplate('../views/destiniesCaroussel.html', 'destinies_caroussel');
    loadTemplate('../views/filtros.html', 'activities_container_filtros');
    loadTemplate('../views/activityContainer.html', 'activities_container_activity', function() {

        /* Agregamos las actividades */
        /*
        agregarActividad(
            "Actividad 1",
            "Descripción de la actividad 1",
            "https://via.placeholder.com/150x150",
            2,
            "15€"
        );
        agregarActividad(
            "Actividad 2",
            "Descripción de la actividad 2",
            "https://via.placeholder.com/150x150",
            3,
            "20€"
        );
        agregarActividad(
            "Actividad 3",
            "Descripción de la actividad 3",
            "https://www.tooltyp.com/wp-content/uploads/2014/10/1900x920-8-beneficios-de-usar-imagenes-en-nuestros-sitios-web.jpg",
            5,
            "35€"
        );
    });
    */
    });

}

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

    const textoDescripcion = document.createElement("p");
    textoDescripcion.textContent = descripcion;
    contenidoTop.appendChild(textoDescripcion);

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