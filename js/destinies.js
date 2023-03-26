document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header', () => logedIn());
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/caroussel.html', 'destinies_caroussel_peninsula', function () {
        loadDestinies('../json/destinos.json', 'peninsula', 'Lugares en la Península', function () {
            waitForElements('.slick_peninsula', carrusel.bind(this, 'peninsula'));
        });
    });
    loadTemplate('../views/caroussel.html', 'destinies_caroussel_canarias', function () {
        loadDestinies('../json/destinos.json', 'canarias', 'Lugares en las Islas Canarias', function () {
            waitForElements('.slick_canarias', carrusel.bind(this, 'canarias'));
        });
    });
    loadTemplate('../views/caroussel.html', 'destinies_caroussel_baleares', function () {
        loadDestinies('../json/destinos.json', 'baleares', 'Lugares en las Islas Baleares', function () {
            waitForElements('.slick_baleares', carrusel.bind(this, 'baleares'));
        });
    });
}

function waitForElements(selector, callback) {
    const intervalId = setInterval(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            clearInterval(intervalId);
            callback();
        }
    }, 100);
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

function carrusel(id) {
    const buttonPrev = document.getElementById('button_prev_' + id);
    const buttonNext = document.getElementById('button_next_' + id);

    buttonPrev.onclick = () => Move(1);
    buttonNext.onclick = () => Move(2);

    function Move(value) {
        const track = document.getElementById(`track_${id}`);
        const slickList = document.getElementById(`slick_list_${id}`);
        const slick = document.querySelectorAll(`.slick_${id}`);

        var style = window.getComputedStyle(slick[0]);
        var marginRight = parseInt(style.marginRight);
        var marginLeft = parseInt(style.marginLeft);

        const slickWidth = slick[0].offsetWidth;
        const trackWidth = track.offsetWidth;
        const slickListWidth = slickList.offsetWidth;

        track.style.left == "" ? leftPosition = track.style.left = 0 : leftPosition = parseFloat(track.style.left.slice(0, -2) * -1);

        if (value == 1 && leftPosition >= slickWidth) {
            track.style.left = `${-1 * (leftPosition - slickWidth - marginLeft - marginRight)}px`;
        } else if (value == 2 && leftPosition < (trackWidth - slickListWidth - marginLeft - marginRight)) {
            track.style.left = `${-1 * (leftPosition + slickWidth + marginLeft + marginRight)}px`;
        } else if (value == 2 && leftPosition >= (trackWidth - slickListWidth - marginLeft - marginRight)) {
            track.style.left = '0';
        } else if (value == 1 && leftPosition < slickWidth) {
            track.style.left = `${-1 * (trackWidth - slickListWidth)}px`;
        }
    }
}

function loadDestinies(url, place, title, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const placeJSON = data[place];
            const destiniesCaroussel = document.getElementById('div_caroussel');
            
            destiniesCaroussel.innerHTML += `
                <div class="carousel_title_container" id="carousel_title_container_${place}">
                <h3 class="carousel_title" id="carousel_title_${place}">${title}</h3>
                <div class="slick_list" id="slick_list_${place}">
                    <button class="slick_arrow slick_prev" id="button_prev_${place}"><i class="bi bi-chevron-left"></i></button>
                    <div class="slick_track" id="track_${place}"></div>
                    <button class="slick_arrow slick_next" id="button_next_${place}"><i class="bi bi-chevron-right"></i></button>
                </div>
                </div>
                `;

            placeJSON.forEach((element, index) => {
                const numStars = element.stars;
                const imageName = element.image.replace(/ /g, '%20');
                const track = document.getElementById(`track_${place}`);
                const starsId = `stars-${index}_${place}`; // Crear un ID único para el contenedor de estrellas
                track.innerHTML += `
                    <div class="slick_${place}" id="slick">
                        <img src="${imageName}" alt="${element.name}" id="image">
                            <div class="destinies_caroussel_item_info">
                                <h3 id="name">${element.name}</h3>
                                <div id="${starsId}" class="stars-container"></div>
                            </div>
                        </div>
                    </div>
                `;
                for (let i = 0; i < numStars; i++) {
                    const star = document.createElement('i');
                    star.classList.add('bi', 'bi-star-fill');
                    document.getElementById(starsId).appendChild(star); // Agregar las estrellas al contenedor correspondiente
                }
            });
            if (callback) {
                callback();
            }
        })
        .catch(error => console.error(error));
}

function logedIn() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        const headerDropdown = document.querySelector('.bi-person .dropdown_content');
        if (headerDropdown) {
            headerDropdown.innerHTML = `
        <a href="../accountManagement.html">Perfil</a>
        <a href="../myActivityList.html">Mis actividades</a>
        <a href="#" onclick="cerrarSesion()">Cerrar sesión</a>`

        }
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
}