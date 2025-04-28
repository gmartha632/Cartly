import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTj8qVmWz9kWq6wxuSCDYE3iljRQZTCFE",
  authDomain: "cartly-314cd.firebaseapp.com",
  projectId: "cartly-314cd",
  storageBucket: "cartly-314cd.firebasestorage.app",
  messagingSenderId: "1075164553188",
  appId: "1:1075164553188:web:8e9a88d063d1541d8371f1",
  measurementId: "G-4LPYG75NPM",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
let userId = localStorage.getItem("userId");

let cart = [];

const fetchAllCartItems = async () => {
  try {
    const cartRef = ref(database, `cart/${userId}`);
    const snapshot = await get(cartRef);

    if (snapshot.exists()) {
      const cartData = snapshot.val();
      cart = Object.keys(cartData).map(key => {
        return {
          ...cartData[key],
          path: key
        };
      });
      console.log("Cart items loaded:", cart);
    } else {
      console.log("No items in cart");
      cart = [];
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
    cart = [];
  }
  updateCartUI();
  updateCartCount();
};

document.addEventListener("DOMContentLoaded", async () => {
  await fetchAllCartItems();

document.getElementById("continueShopping").addEventListener("click", () => {
  const lastCategory = localStorage.getItem("selectedCategory") || "Electronics";
  window.location.href = `${getCorrectPath('Pages/Categories.html')}?category=${encodeURIComponent(lastCategory)}`;
});

});

// Helper function to build correct paths
function getCorrectPath(relativePath) {
  const cleanPath = relativePath.replace(/^\/|\/$/g, '');
  if (window.location.protocol === 'file:') {
    return `${cleanPath}`;
  }
  return `/${cleanPath}`;
}

document.getElementById("continueShopping").addEventListener("click", () => {
  const lastCategory = localStorage.getItem("selectedCategory") || "Electronics";
  window.location.href = `${getCorrectPath('Pages/Categories.html')}?category=${encodeURIComponent(lastCategory)}`;
});

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  localStorage.setItem("orderSummary", JSON.stringify({ items: cart }));
  localStorage.setItem("isFromCartPage", true);
  window.location.href = getCorrectPath("Pages/Checkout.html");
});

let currentItemToRemove = null;
const removeModal = document.getElementById("remove-modal");
const cancelRemoveBtn = document.getElementById("cancel-remove");
const confirmRemoveBtn = document.getElementById("confirm-remove");

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.count || 1), 0);
  document.getElementById("cart-count").textContent = totalItems;
  localStorage.setItem("cartCount", totalItems);
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const subtotalPriceElement = document.getElementById("subtotalPrice");

  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
        <p>Continue shopping to add items</p>
      </div>
    `;
    totalPriceElement.textContent = "₹0";
    if (subtotalPriceElement) subtotalPriceElement.textContent = "₹0";
    return;
  }

  cart.forEach((item) => {
    const itemCount = item.count || 1;
    const itemTotal = itemCount * item.price;
    subtotal += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100'">
      </div>
      <div class="item-info">
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          ${item.description ? `<p class="item-desc">${item.description.substring(0, 50)}...</p>` : ''}
          <p class="price">₹${item.price.toFixed(2)}</p>
        </div>
        <div class="item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn decrease-btn" data-path="${item.path}">
              <i class="fas fa-minus"></i>
            </button>
            <span class="item-count">${itemCount}</span>
            <button class="quantity-btn increase-btn" data-path="${item.path}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="item-total">
            <p class="item-total-price">₹${itemTotal.toFixed(2)}</p>
            <button class="remove-btn" data-path="${item.path}">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  if (subtotalPriceElement) subtotalPriceElement.textContent = `₹${subtotal.toFixed(2)}`;
  totalPriceElement.textContent = `₹${subtotal.toFixed(2)}`;

  if (!eventListenersAttached) {
    setupEventListeners();
  }
}


let eventListenersAttached = false;

function setupEventListeners() {
  if (eventListenersAttached) return;
  
  // Use event delegation for dynamically created elements
  document.addEventListener('click', async (e) => {
    // Handle increase button clicks
    if (e.target.closest('.increase-btn')) {
      e.stopPropagation(); // Prevent event bubbling
      const button = e.target.closest('.increase-btn');
      const itemPath = button.getAttribute('data-path');
      await updateItemCount(itemPath, 1);
    }
    
    // Handle decrease button clicks
    if (e.target.closest('.decrease-btn')) {
      e.stopPropagation(); // Prevent event bubbling
      const button = e.target.closest('.decrease-btn');
      const itemPath = button.getAttribute('data-path');
      await updateItemCount(itemPath, -1);
    }
    
    //Remove button click handler
if (e.target.closest('.remove-btn')) {
  e.stopPropagation();
  const button = e.target.closest('.remove-btn');
  currentItemToRemove = button.getAttribute('data-path');
  showRemoveModal();
}
  });
  
  eventListenersAttached = true;
}

function showRemoveModal() {
  removeModal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
}

function hideRemoveModal() {
  removeModal.classList.remove("active");
  document.body.style.overflow = "auto";
  currentItemToRemove = null;
}

//  event listeners for the modal buttons
cancelRemoveBtn.addEventListener("click", hideRemoveModal);
confirmRemoveBtn.addEventListener("click", async () => {
  if (currentItemToRemove) {
    await removeFromFireBase(currentItemToRemove);
    hideRemoveModal();
  }
});

// Close modal when clicking outside
removeModal.addEventListener("click", (e) => {
  if (e.target === removeModal) {
    hideRemoveModal();
  }
});

async function updateItemCount(itemPath, change) {
  try {
    // Disable buttons during update
    const increaseBtn = document.querySelector(`.increase-btn[data-path="${itemPath}"]`);
    const decreaseBtn = document.querySelector(`.decrease-btn[data-path="${itemPath}"]`);
    
    if (increaseBtn) increaseBtn.disabled = true;
    if (decreaseBtn) decreaseBtn.disabled = true;
    
    const itemIndex = cart.findIndex(item => item.path === itemPath);
    
    if (itemIndex !== -1) {
      const newCount = (cart[itemIndex].count || 1) + change;
      
      // Ensure count stays within reasonable bounds
      if (newCount < 1) return; // Don't allow going below 1
      if (newCount > 99) return; // Set your maximum quantity
      
      // Update the count in the cart array
      cart[itemIndex].count = newCount;
      
      // Update in Firebase
      const itemRef = ref(database, `cart/${userId}/${itemPath}`);
      await set(itemRef, cart[itemIndex]);
      
      // Update the UI
      updateCartUI();
      updateCartCount();
    }
  } catch (error) {
    console.error("Error updating item count:", error);
  } finally {
    // Re-enable buttons
    const increaseBtn = document.querySelector(`.increase-btn[data-path="${itemPath}"]`);
    const decreaseBtn = document.querySelector(`.decrease-btn[data-path="${itemPath}"]`);
    
    if (increaseBtn) increaseBtn.disabled = false;
    if (decreaseBtn) decreaseBtn.disabled = false;
  }
}

async function removeFromFireBase(path) {
  try {
    const itemRef = ref(database, `cart/${userId}/${path}`);
    await remove(itemRef);
    cart = cart.filter(item => item.path !== path);
    updateCartUI();
    updateCartCount();
    
    // Show success message (optional)
    showToast("Item removed from cart");
  } catch (error) {
    console.error("Error removing item:", error);
    showToast("Failed to remove item", true);
  }
}


function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = `toast-notification ${isError ? 'error' : 'success'}`;
  toast.innerHTML = `
    <i class="fas ${isError ? 'fa-times-circle' : 'fa-check-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }, 10);
}