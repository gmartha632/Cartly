import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

let fullData;
let selectedCategory = localStorage.getItem("selectedCategory");
document.getElementById("categoryName").textContent = selectedCategory;

const fetchData = async () => {
    const dbRef = ref(database, `Products/${selectedCategory}`); 
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            fullData = snapshot.val(); 
            let subCategories = Object.keys(fullData);
            displaySideBar(subCategories);
            subCategories.forEach(subCategory => {
                displayData(fullData[subCategory], subCategory,false);
            });
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const displayData = (data,subCategory, isNew) => {
    const productsContainer = document.getElementById("productsContainer");
    if (isNew) {
        productsContainer.innerHTML = "";
    }
    data.forEach((item,index) => {
        const card = document.createElement("div"); 
        card.classList.add("card");
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price}</p>
            </div>
        `;
        productsContainer.appendChild(card);

        card.addEventListener("click", () => {
            localStorage.setItem("selectedSubCategory",subCategory)
            localStorage.setItem("selectedItem", index);
            window.location.href = "../../Pages/ProductDetail.html";
        });
    });
};

function displaySideBar(subCategories) {
    const sidebar = document.getElementById("sidebar"); 
    sidebar.innerHTML = "";

    //  Add "Categories" Heading
    const heading = document.createElement("h2");
    heading.textContent = "Categories";
    heading.classList.add("sidebar-heading");
    sidebar.appendChild(heading);

    //  Create a Container for Subcategory Items
    const subCategoryContainer = document.createElement("div");
    subCategoryContainer.classList.add("sidebar-container");

    //  Add "All" Category
    const allCategoryItem = document.createElement("div");
    allCategoryItem.classList.add("category");
    allCategoryItem.textContent = "All";
    subCategoryContainer.appendChild(allCategoryItem);

    //  Add Subcategories
    subCategories.forEach(subCategory => {
        const subCategoryItem = document.createElement("div");
        subCategoryItem.classList.add("category");
        subCategoryItem.textContent = subCategory;
        subCategoryContainer.appendChild(subCategoryItem);
    });

    sidebar.appendChild(subCategoryContainer);

    //  Handle category selection
    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("click", () => {
            localStorage.setItem("selectedSubCategory", category.textContent);
     
            //  Highlight selected category
            document.querySelectorAll(".category").forEach(item => item.classList.remove("selected"));
            category.classList.add("selected");

            if (category.textContent === "All") {
                subCategories.forEach(subCategory => {
                    displayData(fullData[subCategory],subCategory, false);
                });
            } else {
                displayData(fullData[category.textContent], category.textContent,true);
            }
        });

        //  Set initial selection highlight
        if (category.textContent === localStorage.getItem("selectedSubCategory")) {
            category.classList.add("selected");
        }
    });

    //  Add Sorting Options Below Categories
    const sortingContainer = document.createElement("div");
    sortingContainer.classList.add("sorting-container");

    const sortingTitle = document.createElement("h3");
    sortingTitle.textContent = "Sort By";
    sortingContainer.appendChild(sortingTitle);

    const sortOptions = [
        { label: "A-Z", value: "az" },
        { label: "Z-A", value: "za" },
        { label: "Price: Low to High", value: "low-high" },
        { label: "Price: High to Low", value: "high-low" },
    ];

    sortOptions.forEach(option => {
        const button = document.createElement("button");
        button.classList.add("sort-button");
        button.textContent = option.label;
        button.dataset.sort = option.value;
        button.addEventListener("click", () => {
            applySorting(option.value);

            //  Highlight selected sorting option
            document.querySelectorAll(".sort-button").forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            localStorage.setItem("selectedSort", option.value);
        });

        sortingContainer.appendChild(button);
    });

    sidebar.appendChild(sortingContainer);

    //  Set initial sort selection
    const savedSort = localStorage.getItem("selectedSort");
    if (savedSort) {
        document.querySelector(`.sort-button[data-sort="${savedSort}"]`)?.classList.add("selected");
    }
}

//  Sorting Function
function applySorting(sortType) {
    let selectedSubCategory = localStorage.getItem("selectedSubCategory");
    let items = selectedSubCategory === "All" 
        ? Object.values(fullData).flat() 
        : fullData[selectedSubCategory];

    if (!Array.isArray(items) || items.length === 0) return;

    switch (sortType) {
        case "az":
            items.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "za":
            items.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case "low-high":
            items.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
            break;
        case "high-low":
            items.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
            break;
    }

    displayData(items, true);
}


document.addEventListener("DOMContentLoaded", fetchData);
