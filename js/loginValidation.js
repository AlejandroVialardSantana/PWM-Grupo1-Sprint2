document.addEventListener('DOMContentLoaded', init);

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

function init() {
    loginValidation();
}

function loginValidation() {
    const formularioLogIn = document.getElementById('formularioLogIn');
    formularioLogIn.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario
        const email = document.getElementById('email').value;
        const contraseña = document.getElementById('password').value;
        fetch('../json/users.json')
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error al cargar los datos del archivo JSON.');
            })
            .then(function (data) {
                let usuarioEncontrado = null;
                let error = false;
                for (let i = 0; i < data.users.length; i++) {
                    if (data.users[i].email === email) {
                        usuarioEncontrado = data.users[i];
                        break;
                    }
                }
                if (usuarioEncontrado && usuarioEncontrado.contraseña === contraseña) {
                    localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
                    localStorage.setItem('nombreUsuario', usuarioEncontrado.nombre);
                    localStorage.setItem('apellidoUsuario', usuarioEncontrado.apellido);
                    localStorage.setItem('emailUsuario', usuarioEncontrado.email);
                    alert('Credenciales correctas. Bienvenido, ' + usuarioEncontrado.nombre + ' ' + usuarioEncontrado.apellido + '!');
                    window.location.href = '../index.html';
                } else {
                    if (usuarioEncontrado && usuarioEncontrado.contraseña !== contraseña) {
                        const password_error = document.getElementById('password_error');
                        password_error.innerHTML += '<i class="bi bi-info-circle-fill"></i>La contraseña ingresada es incorrecta.';
                        password_error.style.color = 'red';
                        passwordInput.style.border = '1px solid red';
                        error = true;
                    } else {
                        const email_error = document.getElementById('email_error');
                        email_error.innerHTML += '<i class="bi bi-info-circle-fill"></i>El email ingresado no existe.';
                        email_error.style.color = 'red';
                        emailInput.style.border = '1px solid red';
                        error = true;
                    }
                }
                // Agregar escuchadores de eventos 'click' para eliminar los estilos de error cuando el usuario hace clic en un campo de entrada
                emailInput.addEventListener('click', function () {
                    const emailError = document.getElementById('email_error');
                    emailError.innerHTML = '';
                    emailInput.style.border = '1px solid #ced4da';
                });

                passwordInput.addEventListener('click', function () {
                    const passwordError = document.getElementById('password_error');
                    passwordError.innerHTML = '';
                    passwordInput.style.border = '1px solid #ced4da';
                });
            })
            .catch(function (error) {
                console.log(error.message);
            });
    });
}
