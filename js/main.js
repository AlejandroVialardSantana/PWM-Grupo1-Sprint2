document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/searchBar.html', 'home');
    loadTemplate('../views/caroussel.html', 'destinies_caroussel', function () {
        loadDestinies('../json/destinos.json', '1', 'Destinos destacados', function () {
            waitForElements('.slick_1', carrusel.bind(this, '1'));
        });
    });
    loadTemplate('../views/destiniesRecommendations.html', 'destinies_recommendations', function () {
        loadDestiniesRecommendations('2', 'Más visitados', function () {
            waitForElements('.slick_2', carrusel.bind(this, '2'));
            clickActivity();
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

function clickActivity() {
    const items = document.querySelectorAll(`track_${id}`);

    items.forEach(function (item) {
        item.addEventListener('click', function () {
            const cityName = item.querySelector('.most_visited_destinations_item_info p').textContent;
            const activityName = item.querySelector('.most_visited_destinations_item_info h4').textContent;

            const url = `/activityDescription.html?location=${encodeURIComponent(cityName)}&name=${encodeURIComponent(activityName)}`;
            window.location.href = url;
        });
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

function getRandomDestinies(destinies, numDestinies) {
    const randomDestinies = [];
    for (let i = 0; i < numDestinies; i++) {
        const randomIndex = Math.floor(Math.random() * destinies.length);
        randomDestinies.push(destinies[randomIndex]);
        destinies.splice(randomIndex, 1);
    }
    return randomDestinies;
}

function loadDestinies(url, id, title, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const allDestinies = data.peninsula.concat(data.baleares, data.canarias);
            const fourOrMoreStarsDestinies = allDestinies.filter(destiny => destiny.stars >= 4);
            const randomDestinies = getRandomDestinies(fourOrMoreStarsDestinies, 6);
            const destiniesCaroussel = document.getElementById('div_caroussel');

            destiniesCaroussel.innerHTML += `
                <div class="carousel_title_container" id="carousel_title_container_${id}">
                <h3 class="carousel_title" id="carousel_title_${id}">${title}</h3>
                <div class="slick_list" id="slick_list_${id}">
                    <button class="slick_arrow slick_prev" id="button_prev_${id}"><i class="bi bi-chevron-left"></i></button>
                    <div class="slick_track" id="track_${id}"></div>
                    <button class="slick_arrow slick_next" id="button_next_${id}"><i class="bi bi-chevron-right"></i></button>
                </div>
                </div>
                `;

            randomDestinies.forEach((element, index) => {
                const numStars = element.stars;
                const imageName = element.image.replace(/ /g, '%20');
                const track = document.getElementById(`track_${id}`);
                const starsId = `stars-${index}_${title}`; // Crear un ID único para el contenedor de estrellas
                track.innerHTML += `
                    <div class="slick_${id}" id="slick">
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

function loadDestiniesRecommendations(id, title, callback) {
    const destiniesUrl = ['./json/Madrid.json', './json/Málaga.json', './json/Gran Canaria.json'];
    const randomDestinyUrl = destiniesUrl[Math.floor(Math.random() * destiniesUrl.length)];
  
    fetch(randomDestinyUrl)
      .then(response => response.json())
      .then(data => {
        const randomDestinies = getRandomDestinies(data.activities, 6);
        const destiniesCaroussel = document.getElementById('div_caroussel_recommendations');
        destiniesCaroussel.innerHTML += `
            <div class="carousel_title_container" id="carousel_title_container_${id}">
            <h3 class="carousel_title" id="carousel_title_${id}">${title}</h3>
            <div class="line"></div>
            <div class="slick_list" id="slick_list_${id}">
                <button class="slick_arrow slick_prev" id="button_prev_${id}"><i class="bi bi-chevron-left"></i></button>
                <div class="slick_track" id="track_${id}"></div>
                <button class="slick_arrow slick_next" id="button_next_${id}"><i class="bi bi-chevron-right"></i></button>
            </div>
            </div>
            `;
  
        randomDestinies.forEach((element) => {
          const imageName = element.image.replace(/ /g, '%20');
          const track = document.getElementById(`track_${id}`);
          track.innerHTML += `
              <div class="slick_${id}" id="slick">
                  <img src="${imageName}" alt="${element.name}" id="image">
                      <div class="destinies_caroussel_item_info">
                          <h4 id="name">${element.name}</h3>
                          <p><i class="bi bi-geo-alt">${element.location}</i></p>
                      </div>
                  </div>
              </div>
          `;
        });
        if (callback) {
          callback();
        }
      })
      .catch(error => console.error(error));
  }
  