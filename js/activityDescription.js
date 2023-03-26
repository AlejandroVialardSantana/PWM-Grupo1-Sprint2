document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/activityInfo.html', 'activity_description');
    loadActivity();
    loadTemplate('../views/caroussel.html', 'destinies_caroussel', function () {
        loadDestinies('1', 'Más actividades en ', function () {
            waitForElements('.slick_1', carrusel.bind(this, '1'));
            waitForElements('.slick_1', clickActivity.bind(this, '1'));
        });
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

function loadJSON(url, activityName, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {

            var activity = data.activities.find(function (activity) {
                return activity.name === activityName;
            });

            document.getElementById('activity_img').src = activity.image;
            document.getElementById('activity_img').alt = activity.name;   
            document.getElementById('activity_name').textContent = activity.name;
            document.getElementById('activity_info_description').textContent = activity.description;
            document.getElementById('activity_location').textContent = activity.location;
            document.getElementById("activity_map").setAttribute("src", activity.location_map);
            const reviewsContainer = document.getElementById("reviews_container");

            for (let i = 0; i < activity.user_reviews.length; i++) {
                const review = activity.user_reviews[i];

                const reviewElement = document.createElement("div");
                reviewElement.className = "review";

                const reviewerElement = document.createElement("div");
                reviewerElement.className = "reviewer";
                const usernameElement = document.createElement("p");
                usernameElement.textContent = review.username;
                reviewerElement.appendChild(usernameElement);

                const reviewTextElement = document.createElement("div");
                reviewTextElement.className = "review_text";
                const opinionElement = document.createElement("p");
                opinionElement.textContent = review.opinion;
                reviewTextElement.appendChild(opinionElement);

                reviewElement.appendChild(reviewerElement);
                reviewElement.appendChild(reviewTextElement);

                reviewsContainer.appendChild(reviewElement);
            }

            callback(data);
        });
}

function clickActivity(id) {
    const activities = document.querySelectorAll(`.slick_${id}`);
    activities.forEach(function (activity) {
        activity.addEventListener('click', function () {
            const cityName = activity.querySelector('.destinies_caroussel_item_info p').textContent;
            const activityName = activity.querySelector('.destinies_caroussel_item_info h4').textContent;

            const url = `/activityDescription.html?location=${encodeURIComponent(cityName)}&name=${encodeURIComponent(activityName)}`;
            window.location.href = url;
        });
    });
}

function loadActivity() {
    var urlParams = new URLSearchParams(window.location.search);
    var locationJsonPatch = urlParams.get('location') + ".json";
    var activityName = urlParams.get('name');

    loadJSON('../json/' + locationJsonPatch, activityName, function (data) {

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

function loadDestinies(id, title, callback) {
    var urlParams = new URLSearchParams(window.location.search);
    var locationJsonPatch = "../json/" + urlParams.get('location') + ".json";
 
    fetch(locationJsonPatch)
        .then(response => response.json())
        .then(data => {
            const allActivities = data.activities;
            const randomDestinies = getRandomDestinies(allActivities, 6);
            const destiniesCaroussel = document.getElementById('div_caroussel');

            destiniesCaroussel.innerHTML += `
                <div class="carousel_title_container" id="carousel_title_container_${id}">
                <h3 class="carousel_title" id="carousel_title_${id}">${title} ${urlParams.get('location')}</h3>
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
                            <h4 id="name">${element.name}</h3>
                            <p id="city"><i class="bi bi-geo-alt"></i>${element.city}</p>
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