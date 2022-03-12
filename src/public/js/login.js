fetch('/session/currentUser').then(i => i.json()).then(json => {
    user = json;
    if(user._id) {
        alert('Usuario logueado.')
        location.replace('/');
    }
})

//Login form
let form = document.getElementById('loginForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let data = new FormData(form);

    const user = {
        email: data.get('email'),
        password: data.get('password')
    }
    if(!user.email || !user.password) {
        window.alert('Campos incompletos.');
        console.log('Campos incompletos.')
    } else {
        console.log(user);
        fetch('/session/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type':'application/json'
            }
        })
        .then(result => {
            if (result.status === 200) {
                location.replace('/')
            } else {
                console.log(result)
                window.alert(`Error: ${result.status}`)
            }
        })
    }
})