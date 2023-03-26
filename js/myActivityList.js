document.addEventListener('DOMContentLoaded', init);


function init() {
    loadTemplate('../views/header.html', 'main_header', () => logedIn());
    loadTemplate('../views/footer.html', 'main_footer');
    loadTemplate('../views/searchBar.html', 'home');
    loadTemplate('../views/myActivities.html', 'my_activities');;
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