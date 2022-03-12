
fetch('/session/currentUser').then(i => i.json()).then(json => {
    user = json;
    if(!user._id) {
        location.replace('/');
    } else {
        fetch (`/api/carrito/${user.cart}`).then(i => i.json()).then(json => {
            cart = json;
            if(cart.products) {
                let productos = [];
                let div = document.getElementById('buyProduct');
                let div2 = document.getElementById('totalPrice');
                let totalPrice = 0;
                div.innerHTML = `<h3>Tu carrito incluye:</h3>`
                for(i = 0; i<cart.products.length;i++) {
                    fetch(`/api/productos/${cart.products[i]}`).then(i => i.json()).then(json => {
                        product = json;
                        totalPrice += product.price
                        productos.push(product)
                        div.innerHTML += `<p>${product.name}</p>
                        <p>$${product.price}</p>`
                        div2.innerHTML = `<p class='m-3'><b>Total:$${totalPrice}</b></p>`
                    })
                }
                document.getElementById('buyButton').onclick = function() {
                    fetch('/buyMail');
                    alert('Pedido realizado');
                    location.replace('/')
                }
            }
        })
    }
})

// fetch(`/api/carrito/:${user.cart._id}`), {
//     method: 'GET',
//     body:
// }