let logout = document.getElementById("logout-button")
// logout function
logout.addEventListener("click", () => {
  window.location.href = "../../Pages/Login.html"
});


let cart = document.getElementById('cart-icon') ;
cart.addEventListener('click', () => {
  window.location.href = '../../Pages/Cart.html'; // Navigate to the cart page
});    
    
    // Navigation object for Subcategories

    const categoriesData = {
        "Books": [ "Computer Science" ,"English", "Physics", "Chemistry" , "Maths" , ],
        "Electronics": ["Computers", "Laptops", "Sounds" ,"Projectors"],
        "Stationery": ["Pens", "Notebooks", "Markers" , "Sticky Notes"],
        "Sports": ["Equipments" , "Musical Instruments" , "ActiveWear"],
        "Study Essentials": ["Furniture", "Storage"]
    }; 
    

    // Sorting by Price 
    function createSidebar(category) {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = '';

        //Sort by Price dropdown
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

        // Price sorting change
        document.getElementById('price-sort').addEventListener('change', function () {
            const sortOption = this.value;
            // console.log('Selected sort option:', sortOption);
            
            
            // Add your sorting logic here
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
            createSidebar(category);
        });
    });

    // Initially load the first category (Books) by default
    window.onload = function () {
        createSidebar("Books");
    };


 
  