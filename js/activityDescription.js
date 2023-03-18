document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/destiniesCaroussel.html', 'destinies_caroussel');
    loadTemplate('../views/activityInfo.html', 'activity_description');

    loadJSON('../json/activities.json', function (data) {
    });
}

function loadTemplate(url, id) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

function loadJSON(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('activity_img').src = data.image;
            document.getElementById('activity_name').textContent = data.name;
            document.getElementById('activity_info_description').textContent = data.description;
            document.getElementById('activity_location').textContent = data.location;
            document.getElementById("activity_map").setAttribute("src", data.location_map);
            const reviewsContainer = document.getElementById("reviews_container");

            for (let i = 0; i < data.user_reviews.length; i++) {
                const review = data.user_reviews[i];

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