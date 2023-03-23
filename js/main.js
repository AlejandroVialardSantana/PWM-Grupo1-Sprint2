document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/searchBar.html', 'home');
    loadTemplate('../views/destiniesCaroussel.html', 'destinies_caroussel');
    loadTemplate('../views/destiniesRecommendations.html', 'destinies_recommendations', function() {
        clickActivity();
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

function clickActivity() {
    const items = document.querySelectorAll('.most_visited_destinations_item');

        items.forEach(function(item) {
            item.addEventListener('click', function() {
                const cityName = item.querySelector('.most_visited_destinations_item_info p').textContent;
                const activityName = item.querySelector('.most_visited_destinations_item_info h4').textContent;

                const url = `/activityDescription.html?location=${encodeURIComponent(cityName)}&name=${encodeURIComponent(activityName)}`;
                window.location.href = url;
            });
        });
}