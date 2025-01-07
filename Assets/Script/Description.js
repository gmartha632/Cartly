let logout = document.getElementById("logout-button")
// logout function
logout.addEventListener("click", () => {
  window.location.href = "../../Pages/Login.html"
});

 // cart
let cart = document.getElementById('cart-icon') ;
cart.addEventListener('click', () => {
  window.location.href = '../../Pages/Cart.html'; // Navigate to the cart page
});


//productDescription
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Get the product ID from the URL
    console.log(productId)
    

    fetch('https://xtdcqlytigqdvrptocxx.supabase.co/storage/v1/object/sign/Product-JSON/Products.json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQcm9kdWN0LUpTT04vUHJvZHVjdHMuanNvbiIsImlhdCI6MTczNjEwNzA0OCwiZXhwIjoyMDUxNDY3MDQ4fQ.LAbnKkRpdODXT5x8bRY0YdZaayFwSgCCw4ngsMdIPa8')  // Parse the JSON response

    .then(response => {
        console.log(response);  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then(data => {
        const products = data.products;
        const product = products.find(p => p.name === productId); 
        console.log(product)
        if (product) {
          document.querySelector('.product-image img').src = product.image;
          document.querySelector('.product-details h1').textContent = product.name;
          document.querySelector('.product-details .price').textContent = `${product.price}`;
          document.querySelector('.product-details .description').textContent = product.description;


          const addToCartButton = document.querySelector('.add-to-cart');
          addToCartButton.addEventListener('click', () => {
            const cartItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              description: product.description,
              quantity: 1,  
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if product is already in the cart
            const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
            if (existingItemIndex > -1) {
              // If product exists in the cart, increase its quantity
              cart[existingItemIndex].quantity += 1;
            } else {
              // If product is not in the cart, add it
              cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            window.location.href = '../../Pages/Cart.html'  }) 

        } else {
          console.log('Product not found');
        }
      })
      .catch(error => console.error('Error fetching product details:', error));
});




//Add to cart Button
let addToCart = document.querySelector('.add-to-cart')

addToCart.addEventListener("click",() => {
     window.location.href = '../../Pages/Cart.html';
})

//Buy Now button
 let buy = document.querySelector('.buy-now')

buy.addEventListener("click", ()=> {
    window.location.href = '../../Pages/Checkout.html';

})


