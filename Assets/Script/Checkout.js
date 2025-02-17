import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get,set,remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
let userId=localStorage.getItem("userId")

let isFromCartPage=localStorage.getItem("isFromCartPage")
let cart=[];

const fetchAllCartItems = async () => {
    try {
        const cartRef = ref(database, `cart/${userId}`); 
        const snapshot = await get(cartRef);
        
        if (snapshot.exists()) {
            let cartItems = snapshot.val();
            let cart = [];

            // Collect all fetch promises
            let fetchPromises = Object.keys(cartItems).map(async (cartItem) => {
                try {
                    const dbRef = ref(database, `Products/${cartItem.split("_").join("/")}`); 
                    const cartCountRef = ref(database, `cart/${userId}/${cartItem}`);
                    console.log(`Fetching: Products/${cartItem.split("_").join("/")}`);
                    const snapshot = await get(dbRef);
                    const countSnapshot = await get(cartCountRef);
                    if (snapshot.exists()) {
                        let data = snapshot.val();
                        let count = countSnapshot.val();
                        cart.push({ ...data, count: count, "path": cartItem });
                    } else {
                        console.log("No data available for:", cartItem);
                    }
                } catch (error) {
                    console.error("Error fetching item:", cartItem, error);
                }
            });

            // Wait for all fetch requests to complete
            await Promise.all(fetchPromises);

            console.log("Final Cart:", cart);
            return cart;
        } else {
            console.log("No data available in cart.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching cart data:", error);
    }
};


const fetchProductData = async () => {
    const dbRef = ref(database, `Products/${selectedCategory}/${selectedSubCategory}/${selectedItemIndex}`); 
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {            
            cart.push(snapshot.val())
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};





document.addEventListener("DOMContentLoaded", async () => {
    if (isFromCartPage) {
        cart = await fetchAllCartItems();  // ✅ Store the returned data in `cart`
    } else {
        await fetchProductData();
    }

    console.log("Cart Data Before Rendering:", cart); // ✅ Debugging Step

    updateCartUI(); // ✅ Call UI update after data fetch
});

// Function to update the UI
function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartItems");
    const totalPriceElement = document.getElementById("totalPrice");
    const placeOrderButton = document.getElementById("placeOrder");
  
    
    cartItemsContainer.innerHTML = ""; // Clear old items
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceElement.textContent = "0";
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <p>${item.name} - ₹${item.price}</p>
        `;
        cartItemsContainer.appendChild(itemDiv);
        totalPrice += item.count * item.price;
    });

    totalPriceElement.textContent = totalPrice;

    
  // Handle order placement
  placeOrderButton.addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    if (!name || !email || !address) {
        alert("Please fill all details!");
        return;
    }

    // Save order to localStorage (or send to server)
    const orderDetails = {
        name,
        email,
        address,
        payment,
        cart,
        totalPrice
    };

    alert("Order Placed Successfully!");
    if (isFromCartPage) {
      clearCart()
    }
});
}





async function clearCart() {
  try {
    const cartRef = ref(database, `cart/${userId}`); 
    await remove(cartRef)
    localStorage.setItem("cartCount",0)
    document.getElementById("cart-count").textContent =0;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
