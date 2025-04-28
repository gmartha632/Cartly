import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  remove
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration (same as your cart page)
const firebaseConfig = {
  apiKey: "AIzaSyCTj8qVmWz9kWq6wxuSCDYE3iljRQZTCFE",
  authDomain: "cartly-314cd.firebaseapp.com",
  projectId: "cartly-314cd",
  storageBucket: "cartly-314cd.appspot.com",
  messagingSenderId: "1075164553188",
  appId: "1:1075164553188:web:8e9a88d063d1541d8371f1",
  measurementId: "G-4LPYG75NPM"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
let userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", async () => {
  // Load cart items from localStorage or Firebase
  let orderItems = [];
  
  // Check if coming from cart page
  const orderSummary = localStorage.getItem("orderSummary");
  if (orderSummary) {
    orderItems = JSON.parse(orderSummary).items || [];
  } else {
    // If coming directly to checkout, fetch from Firebase
    const cartRef = ref(database, `cart/${userId}`);
    const snapshot = await get(cartRef);
    if (snapshot.exists()) {
      const cartData = snapshot.val();
      orderItems = Object.keys(cartData).map(key => ({
        ...cartData[key],
        path: key
      }));
    }
  }

  // Initialize checkout
  renderOrderSummary(orderItems);
  setupEventListeners();
  updateCartCount();
});

function renderOrderSummary(items) {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");
  
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (items.length === 0) {
    cartItemsContainer.innerHTML = "<p>No items in cart</p>";
    totalPriceElement.textContent = "0";
    return;
  }

  items.forEach(item => {
    const itemCount = item.count || 1;
    const itemTotal = itemCount * item.price;
    total += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "checkout-item";
    itemElement.innerHTML = `
      
      <div class="checkout-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price.toFixed(2)} × ${itemCount}</p>
      </div>
      <div class="checkout-item-total">
        ₹${itemTotal.toFixed(2)}
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  totalPriceElement.textContent = total.toFixed(2);
}

function setupEventListeners() {
  // Place order button
  document.getElementById("placeOrder").addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (validateCheckoutForm()) {
      await placeOrder();
    }
  });

  // Continue shopping button in success modal
  document.getElementById("continueShopping").addEventListener("click", () => {
    window.location.href = getCorrectPath("index.html");
  });

  // Close modal button
  document.querySelector(".close-modal").addEventListener("click", () => {
    document.getElementById("successModal").classList.remove("active");
  });
}

function validateCheckoutForm() {
    const requiredFields = ["name", "email", "address"];
    let isValid = true;
    
    // Clear previous error messages
    const existingContainer = document.getElementById('error-container');
    if (existingContainer) existingContainer.remove();
    
    // Validate required fields
    const missingFields = [];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error-field');
            missingFields.push(fieldId);
            isValid = false;
        } else {
            field.classList.remove('error-field');
        }
    });

    // Validate email format
    const email = document.getElementById("email").value;
    let emailValid = true;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("email").classList.add("error-field");
        emailValid = false;
        isValid = false;
    }

    // Create error container if needed
    if (!isValid) {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.className = 'error-container';
        
        errorContainer.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div class="error-messages">
                ${missingFields.length ? `
                    <p class="error-message">Please fill in all required fields</p>
                ` : ''}
                ${!emailValid ? `
                    <p class="error-message">Please enter a valid email address</p>
                ` : ''}
            </div>
        `;

        const form = document.getElementById('checkoutForm');
        form.insertBefore(errorContainer, form.firstChild);
        
        // Smooth scroll to errors
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

async function placeOrder() {
  try {
    // Get order details
    const orderSummary = localStorage.getItem("orderSummary");
    const orderItems = orderSummary ? JSON.parse(orderSummary).items : [];
    const total = document.getElementById("totalPrice").textContent;
    
    // Get customer details
    const customerDetails = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      paymentMethod: document.getElementById("payment").value
    };

    // Create order object
    const order = {
      userId: userId,
      items: orderItems,
      total: parseFloat(total),
      customerDetails: customerDetails,
      status: "processing",
      date: new Date().toISOString()
    };

    // Save to Firebase
    const ordersRef = ref(database, `orders/${userId}`);
    const newOrderRef = push(ordersRef);
    await set(newOrderRef, order);
    
    // Generate order ID (using Firebase push ID)
    const orderId = newOrderRef.key;
    
    // Clear cart
    if (orderItems.length > 0) {
      const cartRef = ref(database, `cart/${userId}`);
      await remove(cartRef);
    }

    // Show success modal
    document.getElementById("successModal").classList.add("active");
    
    // Update cart count
    updateCartCount(0);
    localStorage.setItem("cartCount", "0");
    
    // Clear order summary from localStorage
    localStorage.removeItem("orderSummary");
  } catch (error) {
    console.error("Error placing order:", error);
    alert("There was an error processing your order. Please try again.");
  }
}

function updateCartCount() {
  const cartCount = localStorage.getItem("cartCount") || "0";
  document.getElementById("cart-count").textContent = cartCount;
}

// Helper function to build correct paths (same as in cart page)
function getCorrectPath(relativePath) {
  const cleanPath = relativePath.replace(/^\/|\/$/g, '');
  if (window.location.protocol === 'file:') {
    return `${cleanPath}`;
  }
  return `/${cleanPath}`;
}