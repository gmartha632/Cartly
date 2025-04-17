import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get ,set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);


// Data 
let fullData;
let selectedCategory = localStorage.getItem("selectedCategory");
document.getElementById("categoryName").textContent = selectedCategory;

// Initialize cart count
document.addEventListener("DOMContentLoaded", () => {
    const cartCount = localStorage.getItem("cartCount") || 0;
    document.getElementById("cart-count").textContent = cartCount;
    fetchData();
  });

const fetchData = async () => {
    const dbRef = ref(database, `Products/${selectedCategory}`); 
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            fullData = snapshot.val(); 
            let subCategories = Object.keys(fullData);
            displaySideBar(subCategories);

            // Display all products initially
      let allProducts = [];
      subCategories.forEach(subCategory => {
        allProducts = allProducts.concat(fullData[subCategory]);
      });

      displayData(allProducts, "All");
            
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Display products
const displayData = (products, subCategory) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";
    
    if (products.length === 0) {
      productsContainer.innerHTML = "<p>No products found in this category.</p>";
      return;
    }
    
    products.forEach((product, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="card-content">
          <h3>${product.name}</h3>
          <p class="price">₹${product.price}</p>
        </div>
      `;
      
      card.addEventListener("click", () => {
        showProductDetail(product, subCategory, index);
      });
      
      productsContainer.appendChild(card);
    });
  };

// Display sidebar with categories
const displaySideBar = (subCategories) => {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = `
      <h2 class="sidebar-heading">Categories</h2>
      <div class="sidebar-container">
        <div class="category selected" data-category="All">All</div>
        ${subCategories.map(subCat => `
          <div class="category" data-category="${subCat}">${subCat}</div>
        `).join('')}
      </div>
      <div class="sorting-container">
        <h3>Sort By</h3>
        <button class="sort-button" data-sort="az">A-Z</button>
        <button class="sort-button" data-sort="za">Z-A</button>
        <button class="sort-button" data-sort="low-high">Price: Low to High</button>
        <button class="sort-button" data-sort="high-low">Price: High to Low</button>
      </div>
    `;
    
    // Category selection
    document.querySelectorAll(".category").forEach(category => {
      category.addEventListener("click", () => {
        const selectedCat = category.dataset.category;
        localStorage.setItem("selectedSubCategory", selectedCat);
        
        document.querySelectorAll(".category").forEach(c => c.classList.remove("selected"));
        category.classList.add("selected");
        
        let productsToShow = [];
        if (selectedCat === "All") {
          Object.values(fullData).forEach(subCatProducts => {
            productsToShow = productsToShow.concat(subCatProducts);
          });
        } else {
          productsToShow = fullData[selectedCat] || [];
        }
        
        displayData(productsToShow, selectedCat);
      });
    });
    
    // Sorting functionality
    document.querySelectorAll(".sort-button").forEach(button => {
      button.addEventListener("click", () => {
        const sortType = button.dataset.sort;
        applySorting(sortType);
        
        document.querySelectorAll(".sort-button").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        localStorage.setItem("selectedSort", sortType);
      });
    });
    
    // Apply saved sort if exists
    const savedSort = localStorage.getItem("selectedSort");
    if (savedSort) {
      const sortButton = document.querySelector(`.sort-button[data-sort="${savedSort}"]`);
      if (sortButton) {
        sortButton.click();
      }
    }
  };


   
// Apply sorting
const applySorting = (sortType) => {
    const selectedSubCategory = localStorage.getItem("selectedSubCategory") || "All";
    let products = [];
    
    if (selectedSubCategory === "All") {
      Object.values(fullData).forEach(subCatProducts => {
        products = products.concat(subCatProducts);
      });
    } else {
      products = fullData[selectedSubCategory] || [];
    }
    
    switch (sortType) {
      case "az":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-high":
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "high-low":
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
    }
    
    displayData(products, selectedSubCategory);
  };


const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const suggestionsList = document.getElementById("suggestions-list");



function debounce(func, delay) {
         let timer;
        return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
        };
    }

// Fetch and Filter Products from Firebase on Every Search
const productsRef = ref(database, "Products");

const searchProducts = async (query) => {
    if (!query.trim()) {
        suggestionsList.innerHTML = "";
        return;
    }

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
          
            let allProducts = [];
      
            Object.values(data).forEach(category => {
              Object.values(category).forEach(subCategory => {
                allProducts = allProducts.concat(subCategory);
              });
            });


            let filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );

            showSuggestions(filtered);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
  };

// Display Search Suggestions Dynamically
const showSuggestions = (products) => {
    suggestionsList.innerHTML = "";

    if (products.length === 0) {
        return;
    }

    products.slice(0, 5).forEach(product => {
        const li = document.createElement("li");
        li.textContent = product.name;
        li.addEventListener("click", () => {
            searchInput.value = product.name;
            suggestionsList.innerHTML = "";
            
            showProductDetail(product, "Search Results", 0); 
        });
        suggestionsList.appendChild(li);
    });
};


// Attach Debounced Search to Input Field
searchInput.addEventListener("input", debounce(() => {
    searchProducts(searchInput.value);
    showSuggestions(filteredProducts);
  }, 300));

// Search Button Click Event
searchButton.addEventListener("click",async () => {
  const query = searchProducts(searchInput.value.trim());
   if (!query) return;
    
    const filteredProducts = await searchProducts(query);
    if (filteredProducts.length > 0) {
        showProductDetail(filteredProducts[0], "Search Results", 0);
    } else {
        alert("No products found matching your search");
    } 
});

// Product detail functionality
const showProductDetail = (product, subCategory, index) => {
  document.getElementById("productsContainer").style.display = "none";
  document.getElementById("productDetail").style.display = "flex";
  
  document.getElementById("productImage").src = product.image;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `₹${product.price}`;
  document.getElementById("productDescription").textContent = 
    product.description || "No description available";
  
  document.getElementById("addToCart").onclick = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showPopup("Please login to add items to cart");
        return;
      }
      
      // Create a unique path for the product
      const productPath = `${selectedCategory}_${subCategory}_${index}`;
      const cartRef = ref(database, `cart/${userId}/${productPath}`);
      
      try {
        const snapshot = await get(cartRef);
        let currentCount = snapshot.exists() ? snapshot.val().count || 0 : 0;
        const newCount = currentCount + 1;
        
        // Store the entire product data along with count
        await set(cartRef, {
          ...product,
          count: newCount,
          path: productPath  // Store the path for reference
        });
        
        // Update cart count
        let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
        if (currentCount === 0) {
          cartCount += 1;
          localStorage.setItem("cartCount", cartCount);
          document.getElementById("cart-count").textContent = cartCount;
        }
        
        showPopup("Added to Cart Successfully");
      } catch (error) {
        console.error("Error adding to cart:", error);
        showPopup("Failed to add to cart");
      }
    };
  
  document.getElementById("buyNow").onclick = () => {
    localStorage.setItem("isFromCartPage", false);
    window.location.href = "checkout.html";
  };
};


document.getElementById("closeDetail").addEventListener("click", () => {
  document.getElementById("productDetail").style.display = "none";
  document.getElementById("productsContainer").style.display = "flex";
});

function showPopup(message) {
  const popup = document.getElementById("popupMessage");
  if (!popup) return;

  popup.textContent = message;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000); // Matches your visibility duration
}

// Update cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  const cartCount = localStorage.getItem("cartCount") || 0;
  document.getElementById("cart-count").textContent = cartCount;
});
  
