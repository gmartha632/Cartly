import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, get,set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);



let userId=localStorage.getItem("userId")

let isLoggedIn = localStorage.getItem("isLoggedIn");
const logoutButton = document.getElementById("logout");
logoutButton.textContent = isLoggedIn ? "Log out" : "Log in";

logoutButton.addEventListener("click", () => {
  if (isLoggedIn) {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        localStorage.setItem("isLoggedIn", false);
        window.location.href = "../../Pages/Login.html";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  } else {
    window.location.href = "../../Pages/Login.html";
  }
});


let cart = document.getElementById("cart-icon");
cart.addEventListener("click", () => {
  window.location.href = "../../Pages/Cart.html";
});




async function fetchCartCount() {
  try {
    const cartRef = ref(database, `cart/${userId}`); // Ensure it targets the user's cart   
    const snapshot = await get(cartRef);
    if (snapshot.exists()) {
      let data=snapshot.val()
      console.log(data);
      let count=Object.keys(data).length;
      localStorage.setItem("cartCount",count)
      document.getElementById("cart-count").textContent =count;
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchCartCount()