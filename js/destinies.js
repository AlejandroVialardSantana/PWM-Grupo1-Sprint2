document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/caroussel.html', 'caroussel_peninsula', function () {
        carrusel();
        destinosJSON('peninsula', 'Lugares en la Península');
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

function carrusel() {
    const buttonPrev = document.getElementById('button_prev');
    const buttonNext = document.getElementById('button_next');

    buttonPrev.onclick = () => Move(1);
    buttonNext.onclick = () => Move(2);

    function Move(value) {
        const track = document.getElementById('track');
        const slickList = document.getElementById('slick_list');
        const slick = document.querySelectorAll('.slick');

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
            const carousselTitle = document.getElementById('carousel_title');
            const track = document.getElementById('track');
            const placeJSON = data[place];
            
            carousselTitle.innerHTML = title;
            
            placeJSON.forEach((element, index) => {
                const numStars = element.stars;
                const imageName = element.image.replace(/ /g, '%20');
                const starsId = `stars-${index}`; // Crear un ID único para el contenedor de estrellas
                track.innerHTML += `
                    <div class="slick" id="slick">
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
