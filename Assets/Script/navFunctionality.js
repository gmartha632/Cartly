import { auth, database } from "./firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize elements
  const logoutButton = document.getElementById("logout");
  const cart = document.getElementById("cart-icon");
  const logoutModal = document.getElementById("logout-modal");
  const cancelLogout = document.getElementById("cancel-logout");
  const confirmLogout = document.getElementById("confirm-logout");
  const myOrdersBtn = document.getElementById("my-orders");

  // Auth state observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.uid);
      document.getElementById("logout-text").textContent = "Log out";
      fetchCartCount(user.uid);
    } else {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("userId");
      document.getElementById("logout-text").textContent = "Log in";
    }
  });

  // Cart click handler
  if (cart) {
    cart.addEventListener("click", () => {
      window.location.href = "../../Pages/Cart.html";
    });
  }

  // My Orders click handler
  if (myOrdersBtn) {
    myOrdersBtn.addEventListener("click", () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        window.location.href = "../../Pages/Login.html";
        return;
      }
      window.location.href = "../../Pages/tracking.html";
    });
  }

  // Logout button click handler
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      
      if (isLoggedIn) {
        logoutModal.classList.add("active");
      } else {
        window.location.href = "../../Pages/Login.html";
      }
    });
  }

  // Cancel logout handler
  if (cancelLogout) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.classList.remove("active");
    });
  }

  // Confirm logout handler
  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      signOut(auth).then(() => {
        logoutModal.classList.remove("active");
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("userId");
        window.location.href = "../../Pages/Login.html";
      }).catch((error) => {
        console.error("Error signing out:", error);
      });
    });
  }

  // Close modal when clicking outside
  if (logoutModal) {
    logoutModal.addEventListener("click", (e) => {
      if (e.target === logoutModal) {
        logoutModal.classList.remove("active");
      }
    });
  }

  // Fetch cart count function
  async function fetchCartCount(userId) {
    try {
      const cartRef = ref(database, `cart/${userId}`);
      const snapshot = await get(cartRef);
      if (snapshot.exists()) {
        const count = Object.keys(snapshot.val()).length;
        document.getElementById("cart-count").textContent = count;
      } else {
        document.getElementById("cart-count").textContent = 0;
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
      document.getElementById("cart-count").textContent = 0;
    }
  }
});