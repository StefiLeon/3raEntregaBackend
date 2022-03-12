const socket = io();

//Eventos de socket
socket.on('updateProducts', productos => {
    console.log(productos)
    fetch('templates/productsTable.handlebars').then(string => string.text()).then(template => {
        const processedTemplate = Handlebars.compile(template);
        const templateObject = {
            productos:productos
        }
        const html = processedTemplate(templateObject);
        let tabla = document.getElementById('productsTable');
        tabla.innerHTML = html;
    })
})

//Form
document.addEventListener('submit', sendForm);
fetch('./templates/productsTable.handlebars');
function sendForm(e) {    
    e.preventDefault();
    let form = document.getElementById('prodForm');
    let data = new FormData(form);
    fetch('/api/productos', {
        method:'POST',
        body:data
    }).then(result => {
        return result.json();
    })
    .then(
        location.href='/'
    )
}

//Preview de imagen de producto
document.getElementById("thumbnail").onchange = (e) => {
    let read = new FileReader();
    read.onload = e => {
        document.getElementById("preview").src = e.target.result;
    }
    read.readAsDataURL(e.target.files[0]);
}

//Recuperar usuario
fetch('/session/currentUser').then(i => i.json()).then(json => {
    user = json;
    if(!user._id) {
        let div = document.getElementById('register');
        div.innerHTML = `<p>Ingrese al chat <a class="btn btn-dark" href="./pages/register.html"> registrándose aquí</a></p>
        <p>¿Ya estás registrado? <a class="btn btn-dark" href="./pages/login.html">Inicie sesión aquí</a></p>`
    } else {
        let div = document.getElementById('register');
        div.innerHTML = `<p>Bienvenido a tu perfil, ${user.nombre} ${user.apellido}</p>
        <image style="height:70px;object-fit:contain" src=http://localhost:8080/images/${user.avatar}>
        <button class="btn btn-dark" id='cart'>Ver carrito</a>
        <button class="btn btn-dark" id="logoutSession">Cerrar sesión</button>`;
    }
    document.getElementById('logoutSession').onclick = function() {
        fetch('/session/logout', {
            method: 'GET',
            credentials: 'include' 
        }).then(function(response) {
            console.log(response);
            location.replace('/')
        }).catch(function(err) {
            console.log(err);
        })
    }
    document.getElementById('cart').onclick = function() {
        location.replace('/pages/buy.html')
    }
})