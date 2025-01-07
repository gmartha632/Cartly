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

let checkout = document.getElementById('checkout-button')

checkout.addEventListener("click" , ()=>{
    window.location.href = '../../Pages/Checkout.html'
})




document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Function to render cart items
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
  
        cart.forEach((item, index) => {
            const itemRow = document.createElement('div');
            itemRow.classList.add('cart-item');
            
            itemRow.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Rs. ${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity">+</button>
                    </div>
                    <button class="remove-item">Remove</button>
                </div>
                <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
            `;
            
            // Handle quantity increase and decrease
            const decreaseButton = itemRow.querySelector('.decrease-quantity');
            const increaseButton = itemRow.querySelector('.increase-quantity');
            const removeButton = itemRow.querySelector('.remove-item');
            // const quantityDisplay = itemRow.querySelector('.quantity');
            // const priceDisplay = itemRow.querySelector('.cart-item-price');
            
            // Decrease quantity
            decreaseButton.addEventListener('click', () => {
                updateQuantity(index, -1);
            });
            
            // Increase quantity
            increaseButton.addEventListener('click', () => {
                updateQuantity(index, 1);
            });
            
            // Remove item
            removeButton.addEventListener('click', () => {
                removeItem(index);
            });
            
            cartItemsContainer.appendChild(itemRow);
  
            // Update total price for the cart
            totalPrice += item.price * item.quantity;
        });
  
        // Update total price display
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
  
    // Function to update quantity
    function updateQuantity(index, change) {
        const item = cart[index];
        
        if (item.quantity + change > 0) {
            item.quantity += change;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
  
    // Function to remove item from cart
    function removeItem(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
  
    // Initialize cart display
    renderCart();
    
    // Handle checkout (for now, just an alert)
    checkoutButton.addEventListener('click', () => {
        alert('Proceeding to checkout...');
    });
});

  