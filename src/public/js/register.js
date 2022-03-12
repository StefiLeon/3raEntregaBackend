fetch('/session/currentUser').then(i => i.json()).then(json => {
    user = json;
    if(user._id) {
        alert('Usuario logueado.')
    }
})

//Registro
document.addEventListener('submit', sendForm);
function sendForm(e) {
    e.preventDefault();
    let form = document.getElementById('registerForm');
    let data = new FormData(form);
    fetch('/session/register', {
        method: 'POST',
        body: data
    }).then(result => {
        return result.json();
    })
    .then(response => {
        if(response.error){
            console.log(response.error)
            alert(`No se registro al usuario correctamente: ${response.error}`)
        } else {
            form.reset();
            alert('Usuario registrado. Por favor haga login con sus datos.');
            location.replace('/');
        }
    })
}