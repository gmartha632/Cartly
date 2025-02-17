import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let userId = localStorage.getItem("userId");

let cart = [];

const fetchAllCartItems = async () => {
  try {
    const cartRef = ref(database, `cart/${userId}`);
    const snapshot = await get(cartRef);

    if (snapshot.exists()) {
      let cartItems = snapshot.val();
      cart = []; //  Update global cart array

      // Collect all fetch promises
      let fetchPromises = Object.keys(cartItems).map(async (cartItem) => {
        try {
          const dbRef = ref(
            database,
            `Products/${cartItem.split("_").join("/")}`
          );
          const cartCountRef = ref(database, `cart/${userId}/${cartItem}`);

          console.log(`Fetching: Products/${cartItem.split("_").join("/")}`);
          const snapshot = await get(dbRef);
          const countSnapshot = await get(cartCountRef);

          if (snapshot.exists()) {
            let data = snapshot.val();
            let count = countSnapshot.val();
            cart.push({ ...data, count: count, path: cartItem }); //  Push data to the global cart array
          } else {
            console.log("No data available for:", cartItem);
          }
        } catch (error) {
          console.error("Error fetching item:", cartItem, error);
        }
      });

      // Wait for all fetch requests to complete
      await Promise.all(fetchPromises);

      console.log("Final Cart:", cart); //  Should now reflect the correct cart
    } else {
      console.log("No data available in cart.");
      cart = [];
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await fetchAllCartItems();

  const checkoutButton = document.getElementById("checkout");
  const continueShoppingButton = document.getElementById("continueShopping");

  updateCartUI();

  checkoutButton.addEventListener("click", () => {
    if (cart.length > 0) {
      localStorage.setItem("orderSummary", JSON.stringify({ items: cart }));
      localStorage.removeItem("cart");
      localStorage.setItem("isFromCartPage", true);
      window.location.href = "./Checkout.html";
    } else {
      alert("Your cart is empty!");
    }
  });

  continueShoppingButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});

async function removeFromFireBase(path) {
  const itemRef = ref(database, `cart/${userId}/${path}`);
  await remove(itemRef);
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");

  cartItemsContainer.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceElement.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <p>${item.name} - ₹${item.price}</p>
    <div class="quantity-controls">
        <button class="decrease-btn" data-index="${item.path}">−</button>
        <span class="item-count">${item.count}</span>
        <button class="increase-btn" data-index="${item.path}">+</button>
    </div>
    <button class="remove-btn" data-index="${item.path}">Remove</button>
`;
    cartItemsContainer.appendChild(itemDiv);
    totalPrice += item.count * item.price;
  });

  totalPriceElement.textContent = totalPrice;

  document.querySelectorAll(".increase-btn").forEach((button) => {

    button.addEventListener("click", async (e) => {
        const itemPath = e.target.getAttribute("data-index");
        await updateItemCount(itemPath, 1);
    });
});

document.querySelectorAll(".decrease-btn").forEach((button) => {

    button.addEventListener("click", async (e) => {
        const itemPath = e.target.getAttribute("data-index");
        await updateItemCount(itemPath, -1);
    });
});



  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const data = e.target.getAttribute("data-index");
      cart.splice(data.slice(-1), 1);
      let path = data.slice(0, -1);
      removeFromFireBase(path);
    });
  });
}


async function updateItemCount(itemPath, change) {
    // Find the item in cart
    let item = cart.find((cartItem) => cartItem.path === itemPath);

    if (item) {
        item.count += change;

        // Remove item if count is 0
        if (item.count <= 0) {
            cart = cart.filter((cartItem) => cartItem.path !== itemPath);
            await removeFromFireBase(itemPath);
            let cartCount=localStorage.getItem("cartCount")
            localStorage.setItem("cartCount",cartCount-1)
            document.getElementById("cart-count").textContent =count-1;

        }

        // Immediately update UI
        updateCartUI();

        // Sync change with Firebase (but UI updates instantly)
        const itemRef = ref(database, `cart/${userId}/${itemPath}`);
        if (item.count > 0) {
            await set(itemRef, item.count);
        }
    }
}
