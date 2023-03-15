$(document).ready(function () {
    $('#formularioLogIn').submit(function (event) {
        event.preventDefault(); // Prevenir el envío del formulario
        const email = $('#email').val();
        const contraseña = $('#password').val();
        $.getJSON('../json/users.json', function (data) {
            let usuarioEncontrado = null;
            for (let i = 0; i < data.length; i++) {
                if (data[i].email === email) {
                    usuarioEncontrado = data[i];
                    break;
                }
            }
            if (usuarioEncontrado && usuarioEncontrado.contraseña === contraseña) {
                alert('Credenciales correctas. Bienvenido, ' + usuarioEncontrado.nombre + ' ' + usuarioEncontrado.apellido + '!');
                window.location.href = '../index.html';
            } else {
                alert('Credenciales incorrectas. Inténtalo de nuevo.');
            }
        });
    });
});