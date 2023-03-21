document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/destiniesCaroussel.html', 'destinies_caroussel');
    loadTemplate('../views/activityInfo.html', 'activity_description');
    loadActivity();
}

function loadTemplate(url, id) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
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

function loadActivity() {
    var urlParams = new URLSearchParams(window.location.search);
    var locationJsonPatch = urlParams.get('location') + ".json";
    var activityName = urlParams.get('name');

    loadJSON('../json/' + locationJsonPatch, activityName, function (data) {

    });
}