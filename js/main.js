document.addEventListener("DOMContentLoaded", init);

function init() {
  loadTemplate("../views/header.html", "main_header", ()=>logedIn());
  loadTemplate("../views/footer.html", "main_footer");
  loadTemplate("../views/searchBar.html", "home");
  loadTemplate("../views/destiniesCaroussel.html", "destinies_caroussel");
  loadTemplate("../views/accountManagSections.html", "account_management", ()=>userInformation());
  loadTemplate(
    "../views/destiniesRecommendations.html",
    "destinies_recommendations",
    function () {
      clickActivity();
    }
  );
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
      <a onclick="cerrarSesion()">Cerrar sesión</a>`
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