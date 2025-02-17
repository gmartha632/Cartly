import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
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

let selectedCategory = localStorage.getItem("selectedCategory");
let selectedSubCategory = localStorage.getItem("selectedSubCategory");
let selectedItemIndex=localStorage.getItem("selectedItem")
let userId=localStorage.getItem("userId");
let cartCount=localStorage.getItem("cartCount")
cartCount=Number(cartCount)
const fetchData = async () => {
    const dbRef = ref(database, `Products/${selectedCategory}/${selectedSubCategory}/${selectedItemIndex}`); 
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            let data=snapshot.val()
            displayProduct(data)
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

document.addEventListener("DOMContentLoaded",fetchData);

function displayProduct(product) {
  // Display product details
  document.getElementById("productImage").src = product.image;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("productDescription").textContent = product.description;

  // Add to Cart Functionality
  document.getElementById("addToCart").addEventListener("click", function () {
      let productPath=`cart/${userId}/${selectedCategory}_${selectedSubCategory}_${selectedItemIndex}`
      addToCart(productPath)
  });

  // Buy Now Functionality
  document.getElementById("buyNow").addEventListener("click", function () {
      alert("Proceeding to Checkout...");
      localStorage.setItem("isFromCartPage",false)
      window.location.href = "checkout.html"; // Redirect to checkout page
  });
}

async function addToCart(productPath) {
    const cartRef = ref(database, productPath); 

    try {
      const snapshot = await get(cartRef);
      if (snapshot.exists()) {
          let count=snapshot.val()
          await set(cartRef,count+1)
      } else {
          await set(cartRef,1)
          document.getElementById("cart-count").textContent = cartCount+1;
          localStorage.setItem("cartCount",cartCount+1)
      }
      alert("Added to Cart Successfully")
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

