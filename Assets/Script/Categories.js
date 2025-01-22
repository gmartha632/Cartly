// Profile logout option
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  window.location.href = '../../Pages/Login.html';
});

let cart = document.getElementById('cart-icon');
cart.addEventListener('click', () => {
  window.location.href = '../../Pages/Cart.html'; // Navigate to the cart page
});

// Get the category from the URL
const urlParams = new URLSearchParams(window.location.search);
const categoryFromUrl = urlParams.get('category');

// Navigation object for Subcategories
const categoriesData = {
  "Books": ["Computer Science", "English", "Physics", "Chemistry", "Maths"],
  "Electronics": ["Computers", "Laptops", "Sounds", "Projectors"],
  "Stationery": ["Pens", "Notebooks", "Markers", "Sticky Notes"],
  "Sports": ["Equipments", "Musical Instruments", "ActiveWear"],
  "Study Essentials": ["Furniture", "Storage"]
};

// Sorting by Price
function createSidebar(category) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  // Sort by Price dropdown
  const sortPriceDiv = document.createElement('div');
  sortPriceDiv.classList.add('sort-price');
  sortPriceDiv.innerHTML = `
    <h4>Sort by Price</h4>
    <input type="checkbox" id="low-to-high" class="price-checkbox">
    <label for="low-to-high">Low to High</label><br>
    <input type="checkbox" id="high-to-low" class="price-checkbox">
    <label for="high-to-low">High to Low</label>
  `;
  sidebar.appendChild(sortPriceDiv);

  // Subcategories checkboxes
  const subcategoriesDiv = document.createElement('div');
  subcategoriesDiv.classList.add('subcategories');
  subcategoriesDiv.innerHTML = `<h4>${category}</h4><ul id="subcategories-list"></ul>`;
  sidebar.appendChild(subcategoriesDiv);

  const subcategoriesList = document.getElementById('subcategories-list');

  categoriesData[category].forEach((subcategory, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" id="subcategory${index}" class="subcategory-checkbox">
      <label for="subcategory${index}">${subcategory}</label>
    `;
    subcategoriesList.appendChild(li);
  });

  // Price sorting change (using checkboxes for sorting)
  document.querySelectorAll('.price-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const lowToHigh = document.getElementById('low-to-high').checked;
      const highToLow = document.getElementById('high-to-low').checked;

      if (lowToHigh && !highToLow) {
        console.log('Sorting from Low to High');
        // Implement low-to-high sorting logic here
      } else if (highToLow && !lowToHigh) {
        console.log('Sorting from High to Low');
        // Implement high-to-low sorting logic here
      } else {
        console.log('No sorting or invalid sorting option');
      }

      // Call your sorting logic here based on selected checkboxes
      // Example: Sort products array and update UI accordingly
    });
  });

  // Handle subcategory filtering
  document.querySelectorAll('.subcategory-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const selectedSubcategories = Array.from(document.querySelectorAll('.subcategory-checkbox:checked'))
        .map(checkbox => checkbox.nextElementSibling.innerText);
      console.log('Selected subcategories:', selectedSubcategories);
      // Add your filtering logic here based on selected subcategories
    });
  });
}

// Handle navbar link clicks
const navbarLinks = document.querySelectorAll('.navbar a');
navbarLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const category = link.dataset.category.trim(); // Get category name from the link
    // createSidebar(category);
    window.location.href = `./Categories.html?category=${category}`;
  });
});

// Initially load the first category (Books) by default
window.onload = function () {
  // createSidebar("Books");
  if (categoryFromUrl) {
    createSidebar(categoryFromUrl);
  } else {
    createSidebar("Books"); // Default to "Books" if no category is selected
  }
};
