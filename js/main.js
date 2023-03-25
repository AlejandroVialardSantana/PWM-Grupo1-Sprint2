document.addEventListener("DOMContentLoaded", init);

function init() {
    loadTemplate('../views/header.html', 'main_header', ()=>logedIn());
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/searchBar.html', 'home');
    loadTemplate("../views/accountManagSections.html", "account_management", ()=>userInformation());
    loadTemplate('../views/caroussel.html', 'destinies_caroussel', function () {
        loadDestinies('../json/destinos.json', '1', 'Destinos destacados', function () {
            waitForElements('.slick_1', carrusel.bind(this, '1'));
        });
    });
    loadTemplate('../views/destiniesRecommendations.html', 'destinies_recommendations', function () {
        loadDestiniesRecommendations('2', 'destacado', 'Lugares más visitados', function () {
            waitForElements('.slick_2', carrusel.bind(this, '2'));
            waitForElements('.slick_2', clickActivity.bind(this, '2'));
            loadDestiniesRecommendations('3', 'aire libre', 'Actividades al aire libre', function () {
                waitForElements('.slick_3', carrusel.bind(this, '3'));
                waitForElements('.slick_3', clickActivity.bind(this, '3'));
                loadDestiniesRecommendations('4', 'playa', 'Playas destacadas', function () {
                    waitForElements('.slick_4', carrusel.bind(this, '4'));
                    waitForElements('.slick_4', clickActivity.bind(this, '4'));
                });
            });
        });
    });
}

function clickActivity(id) {
    const activities = document.querySelectorAll(` .slick_${id}`);
    activities.forEach(function(activity) {
        activity.addEventListener('click', function() {
            const cityName = activity.querySelector('.destinies_caroussel_item_info p').textContent;
            const activityName = activity.querySelector('.destinies_caroussel_item_info h4').textContent;

            const url = `/activityDescription.html?location=${encodeURIComponent(cityName)}&name=${encodeURIComponent(activityName)}`;
            window.location.href = url;
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
    .then((response) => response.text())
    .then((data) => {
      const element = document.getElementById(id);
      if(element){
          element.innerHTML = data;
          if (callback) {
            callback();
          }
      } else {
        console.error(`Element with id "${id}" not found`);
      }
    })
    .catch(error => {
        console.error(`Error loading template from ${url}`, error);
    });
}


function clickActivity() {
  const items = document.querySelectorAll(".most_visited_destinations_item");

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      const cityName = item.querySelector(
        ".most_visited_destinations_item_info p"
      ).textContent;
      const activityName = item.querySelector(
        ".most_visited_destinations_item_info h4"
      ).textContent;

      const url = `/activityDescription.html?location=${encodeURIComponent(
        cityName
      )}&name=${encodeURIComponent(activityName)}`;
      window.location.href = url;
    });
  });
}

function logedIn(){
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if(usuario){
    const headerDropdown = document.querySelector('.bi-person .dropdown_content');
    if (headerDropdown) {
      headerDropdown.innerHTML =`
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

function userInformation() {
    const nombre_usuario = localStorage.getItem('nombreUsuario');
    const spanName = document.querySelector('#nombreUsuario');
    spanName.innerHTML = `<span>${nombre_usuario}</span>`;

    const apellido_usuario = localStorage.getItem('apellidoUsuario');
    const spanApellido = document.querySelector('#apellidoUsuario');
    spanApellido.innerHTML = `<span>${apellido_usuario}</span>`;

    const email_usuario = localStorage.getItem('emailUsuario');
    const spanEmail = document.querySelector('#emailUsuario');
    spanEmail.innerHTML = `<span>${email_usuario}</span>`;
};

function carrusel(id, callback) {
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

    if (callback) {
        callback();
    }
}

function getRandomDestinies(destinies, numDestinies) {
    const randomDestinies = [];
    if (destinies.length < numDestinies) {
        numDestinies = destinies.length;
    }

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

async function loadAllDestinies(destiniesUrls, category) {
    const allDestinies = [];
    const loadPromises = [];

    destiniesUrls.forEach(destinyUrl => {
        const loadPromise = fetch(destinyUrl)
            .then(response => response.json())
            .then(data => {
                allDestinies.push(...data.activities.filter(activity => activity.category && activity.category.includes(category)));
            })
            .catch(error => console.error(error));
        loadPromises.push(loadPromise);
    });

    return Promise.all(loadPromises).then(() => allDestinies);
}

function loadDestiniesRecommendations(id, category, title, callback) {
    const destiniesUrls = ['../json/Madrid.json', '../json/Málaga.json', '../json/Gran Canaria.json', '../json/Barcelona.json', ];

    loadAllDestinies(destiniesUrls, category).then(allDestinies => {
        const randomDestinies = getRandomDestinies(allDestinies, 6);

        const destiniesCaroussel = document.getElementById('div_caroussel_recommendations');
        destiniesCaroussel.innerHTML += `
        <div class="most_visited_destinations" id="most_visited_destinations">
          <h3 class="carousel_title" id="carousel_title_${id}">${title}</h3>
          <div class="line"></div>
          <div class="slick_list" id="slick_list_${id}">
            <button class="slick_arrow slick_prev" id="button_prev_${id}"><i class="bi bi-chevron-left"></i></button>
            <div class="slick_track" id="track_${id}"></div>
            <button class="slick_arrow slick_next" id="button_next_${id}"><i class="bi bi-chevron-right"></i></button>
          </div>
        </div>
      `;

        randomDestinies.forEach(element => {
            const imageName = element.image.replace(/ /g, '%20');
            const track = document.getElementById(`track_${id}`);

            track.innerHTML += `
          <div class="slick_${id}" id="slick">
            <img src="${imageName}" alt="${element.name}" id="image">
            <div class="destinies_caroussel_item_info">
              <h4 id="name">${element.name}</h3>
              <p id="city"><i class="bi bi-geo-alt"></i>${element.city}</p>
            </div>
          </div>
        `;
        });

        if (callback) {
            callback();
        }
    }).catch(error => console.error(error));
}
