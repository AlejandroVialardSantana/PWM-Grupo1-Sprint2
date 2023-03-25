function registerNewUser() {
  const formData = new FormData(document.querySelector("#registration-form"));
  const nombre = formData.get("nombre");
  const apellido = formData.get("apellido");
  const email = formData.get("email");
  const contraseña = formData.get("contraseña");

  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((users) => {
      // Verificar si el correo electrónico ya está registrado
      const emailExists = users.some((user) => user.email === email);

      if (emailExists) {
        Swal.fire({
          title: "Error de registro",
          text: "Este correo electrónico ya está registrado.",
          icon: "error",
        });
      } else {
        const newUser = {nombre, apellido, email, contraseña};
        const users = JSON.parse(localStorage.getItem("user")) || [];
        users.push(newUser);
        localStorage.setItem("usuario", JSON.stringify(newUser))
        localStorage.setItem('nombreUsuario', newUser.nombre);
        localStorage.setItem('apellidoUsuario', newUser.apellido);
        localStorage.setItem('emailUsuario', newUser.email);
        window.location.href = '../index.html';
        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Llama a la función después de que se haya cargado el documento HTML
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#registration-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      registerNewUser();
    });
});

//Validar que las dos contraseñas son iguales
function checkPasswords() {
  const password1 = document.getElementById("user_password").value;
  const password2 = document.getElementById("user_password2").value;
  const passwordError = document.getElementById("password-error");
  const btnSubmit = document.getElementById("button_submit");
  if (password1 !== password2) {
    passwordError.style.display = "block";
    btnSubmit.disabled = true;
  } else {
    passwordError.style.display = "none";
    btnSubmit.disabled = false;
  }
}
