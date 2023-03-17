function cambiarContraseña() {
    fetch('/views/changePassword.html')
        .then(response => response.text())
        .then(data => {
            console.log(data);
            document.querySelector('.popup').innerHTML = data;
            document.getElementById('overlay').style.display = 'block';
        });
}
function eliminarCuenta() {
    fetch('/views/deleteAccount.html')
        .then(response => response.text())
        .then(data => {
            console.log(data);
            document.querySelector('.popup').innerHTML = data;
            document.getElementById('overlay').style.display = 'block';
        });
}