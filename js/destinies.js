document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/caroussel.html', 'destinies_caroussel', function () {
        carrusel('peninsula');
        destinosJSON('peninsula', 'Lugares en la Península');
        carrusel('canarias');
        destinosJSON('canarias', 'Lugares en las Islas Canarias');
        carrusel('baleares');
        destinosJSON('baleares', 'Lugares en las Islas Baleares');
    });
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
    const buttonPrev = document.getElementById(`button_prev_${id}`);
    const buttonNext = document.getElementById(`button_next_${id}`);

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

function destinosJSON(place, title) {
    fetch('../json/destinos.json')
        .then(response => response.json())
        .then(data => {
            const carousselTitle = document.getElementById(`carousel_title_${place}`);
            const track = document.getElementById(`track_${place}`);
            const placeJSON = data[place];
            
            carousselTitle.innerHTML = title;
            
            placeJSON.forEach((element, index) => {
                const numStars = element.stars;
                const imageName = element.image.replace(/ /g, '%20');
                const starsId = `stars-${index}_${place}`; // Crear un ID único para el contenedor de estrellas
                track.innerHTML += `
                    <div class="slick_${place}" id="slick">
                        <img src="${imageName}" alt="${element.name}" id="image">
                        <div class="destinies_caroussel_item_info">
                            <h3 id="name">${element.name}</h3>
                            <div id="${starsId}" class="stars-container"></div>
                        </div>
                    </div>
                `;
                for (let i = 0; i < numStars; i++) {
                    const star = document.createElement('i');
                    star.classList.add('bi', 'bi-star-fill');
                    document.getElementById(starsId).appendChild(star); // Agregar las estrellas al contenedor correspondiente
                }
            });
        })
        .catch(error => console.error(error));
}
