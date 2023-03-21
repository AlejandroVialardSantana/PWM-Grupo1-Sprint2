document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTemplate('../views/header.html', 'main_header');
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/searchBar.html', 'home');
    loadTemplate('../views/destiniesCaroussel.html', 'destinies_caroussel');
    loadTemplate('../views/destiniesRecommendations.html', 'destinies_recommendations');
    loadTemplate('../views/accountManagSections.html', 'account_management');
    loadTemplate('../views/caroussel.html', 'caroussel');
    loadTemplate('../views/aboutUsTemplate.html', 'about_us');
}

function loadTemplate(url, id) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}