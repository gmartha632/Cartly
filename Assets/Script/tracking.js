import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  get, 
  query,
  orderByChild,
  equalTo
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const userId = localStorage.getItem("userId");

// DOM Elements
const orderList = document.getElementById("order-list");
const orderModal = document.getElementById("order-modal");
const closeModal = document.querySelector(".close-modal");
const searchBtn = document.getElementById("search-btn");
const orderSearch = document.getElementById("order-search");
const viewAllOrdersBtn = document.getElementById("view-all-orders");
const logoutBtn = document.getElementById("logout");

// Status timeline configuration
const statusTimeline = {
  processing: ["processing", "shipped", "delivered"],
  shipped: ["shipped", "delivered"],
  delivered: ["delivered"],
  cancelled: ["cancelled"]
};

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  if (!userId) {
    window.location.href = "../index.html";
    return;
  }

  // Update cart count
  updateCartCount();
  
  // Load user's orders
  loadUserOrders();
  
  // Setup event listeners
  setupEventListeners();
});

// Update cart count from localStorage
function updateCartCount() {
  const cartCount = localStorage.getItem("cartCount") || "0";
  document.getElementById("cart-count").textContent = cartCount;
}

// Load all orders for the current user
async function loadUserOrders(searchTerm = "") {
  try {
    showLoading();
    
    const ordersRef = ref(database, "orders");
    const userOrdersQuery = query(ordersRef, orderByChild("userId"), equalTo(userId));
    const snapshot = await get(userOrdersQuery);
    
    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      let ordersArray = Object.entries(ordersData).map(([key, value]) => ({
        id: key,
        ...value
      }));
      
      // Filter by search term if provided
      if (searchTerm) {
        ordersArray = ordersArray.filter(order => 
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
        
        )}
      
      displayOrders(ordersArray);
    } else {
      displayNoOrders();
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    showError("Failed to load orders. Please try again.");
  }
}

// Display orders in the UI
function displayOrders(orders) {
  orderList.innerHTML = "";
  
  if (orders.length === 0) {
    displayNoOrders();
    return;
  }
  
  // Sort orders by date (newest first)
  orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  orders.forEach(order => {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";
    orderCard.dataset.orderId = order.id;
    
    // Create preview of first 2 items
    const itemsPreview = order.items.slice(0, 2).map(item => `
      <div class="order-item-preview">
        <img src="${item.imageUrl || 'https://via.placeholder.com/60'}" alt="${item.name}">
        <div>
          <p>${item.name}</p>
          <small>Qty: ${item.count || 1}</small>
        </div>
      </div>
    `).join("");
    
    // Show "+X more" if there are more than 2 items
    const moreItemsText = order.items.length > 2 
      ? `<p class="more-items">+${order.items.length - 2} more items</p>`
      : "";
    
    orderCard.innerHTML = `
      <div class="order-header">
        <div>
          <span class="order-id">Order #${order.id}</span>
          <span class="order-date">${formatDate(order.timestamp)}</span>
        </div>
        <span class="order-status status-${order.status}">${capitalizeFirstLetter(order.status)}</span>
      </div>
      <div class="order-items-preview">
        ${itemsPreview}
      </div>
      ${moreItemsText}
      <div class="order-total">
        Total: ₹${order.total}
      </div>
    `;
    
    orderCard.addEventListener("click", () => showOrderDetails(order));
    orderList.appendChild(orderCard);
  });
}

// Show loading state
function showLoading() {
  orderList.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading your orders...</p>
    </div>
  `;
}

// Display message when no orders found
function displayNoOrders() {
  orderList.innerHTML = `
    <div class="no-orders">
      <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 1rem;"></i>
      <h3>No orders found</h3>
      <p>You haven't placed any orders yet.</p>
      <a href="../index.html" class="btn">Start Shopping</a>
    </div>
  `;
}

// Show order details in modal
function showOrderDetails(order) {
  // Set order ID
  document.getElementById("modal-order-id").textContent = `Order #${order.id}`;
  
  // Set status timeline
  const timelineContainer = document.getElementById("status-timeline");
  timelineContainer.innerHTML = "";
  
  const statusSteps = statusTimeline[order.status] || ["processing"];
  const allStatuses = ["processing", "shipped", "delivered"];
  
  allStatuses.forEach((status, index) => {
    const isActive = statusSteps.includes(status);
    const isCurrent = status === order.status;
    
    const stepElement = document.createElement("div");
    stepElement.className = "status-step";
    if (isActive) stepElement.classList.add("active");
    
    stepElement.innerHTML = `
      <div class="status-icon ${isActive ? 'active' : ''}">
        <i class="fas ${getStatusIcon(status)}"></i>
      </div>
      <span class="status-label ${isActive ? 'active' : ''}">
        ${capitalizeFirstLetter(status)}
      </span>
    `;
    
    timelineContainer.appendChild(stepElement);
  });
  
  // Set order items
  const itemsContainer = document.getElementById("modal-order-items");
  itemsContainer.innerHTML = "";
  
  order.items.forEach(item => {
    const itemElement = document.createElement("div");
    itemElement.className = "order-item";
    itemElement.innerHTML = `
      <img src="${item.imageUrl || 'https://via.placeholder.com/80'}" alt="${item.name}">
      <div class="order-item-details">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-price">₹${item.price.toFixed(2)}</div>
        <div class="order-item-quantity">Quantity: ${item.count || 1}</div>
      </div>
      <div class="order-item-total">₹${(item.price * (item.count || 1)).toFixed(2)}</div>
    `;
    itemsContainer.appendChild(itemElement);
  });
  
  // Set order summary
  document.getElementById("modal-subtotal").textContent = `₹${order.total}`;
  document.getElementById("modal-total").textContent = `₹${order.total}`;
  
  // Set shipping info
  const { name, email, address } = order.customerInfo;
  document.getElementById("modal-shipping-name").textContent = name;
  document.getElementById("modal-shipping-address").textContent = address;
  document.getElementById("modal-shipping-email").textContent = email;
  
  // Show modal
  orderModal.style.display = "block";
}

// Setup event listeners
function setupEventListeners() {
  // Close modal
  closeModal.addEventListener("click", () => {
    orderModal.style.display = "none";
  });
  
  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === orderModal) {
      orderModal.style.display = "none";
    }
  });
  
  // Search orders
  searchBtn.addEventListener("click", () => {
    const searchTerm = orderSearch.value.trim();
    loadUserOrders(searchTerm);
  });
  
  // Search on Enter key
  orderSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = orderSearch.value.trim();
      loadUserOrders(searchTerm);
    }
  });
  
  // View all orders
  viewAllOrdersBtn.addEventListener("click", () => {
    orderSearch.value = "";
    loadUserOrders();
  });
  
  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("cartCount");
      window.location.href = "../index.html";
    });
  }
}

// Helper functions
function formatDate(timestamp) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(timestamp).toLocaleDateString('en-US', options);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStatusIcon(status) {
  const icons = {
    processing: "fa-cog",
    shipped: "fa-truck",
    delivered: "fa-check",
    cancelled: "fa-times"
  };
  return icons[status] || "fa-info-circle";
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  // Remove existing error if any
  const existingError = document.querySelector(".error-message");
  if (existingError) existingError.remove();
  
  document.querySelector(".tracking-container").prepend(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}