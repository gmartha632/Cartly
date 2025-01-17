let logout = document.getElementById("logout-button")
// logout function
logout.addEventListener("click", () => {
  window.location.href = "../../Pages/Login.html"
});

// Cart navigation
let cart = document.getElementById('cart-icon') ;
cart.addEventListener('click', () => {
  window.location.href = '../../Pages/Cart.html'; 
});



document.addEventListener('DOMContentLoaded', () => {
  fetch('https://xtdcqlytigqdvrptocxx.supabase.co/storage/v1/object/sign/Product-JSON/Products.json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQcm9kdWN0LUpTT04vUHJvZHVjdHMuanNvbiIsImlhdCI6MTczNjEwNzA0OCwiZXhwIjoyMDUxNDY3MDQ4fQ.LAbnKkRpdODXT5x8bRY0YdZaayFwSgCCw4ngsMdIPa8') .then(response => response.json())  // Parse the JSON response
    .then(data => {
      const products = data.products; // Access the products array
      const carousel = document.querySelector('.carousel');
      const arrowBtns = document.querySelectorAll('.wrapper i');
      const wrapper = document.querySelector('.wrapper');
       console.log(products)
      // Append products to the carousel
      products.forEach(product => {
        const productElement = document.createElement('li');
        productElement.classList.add('card');
        productElement.setAttribute('data-id', product.name);

        productElement.innerHTML = `    <div class="img">
            <img src="${product.image}" alt="${product.name}" draggable="false">
          </div>
          <h2>${product.name}</h2>
          <span>${product.price}</span> `

          ;
       carousel.appendChild(productElement);
       console.log(productElement.dataset.id)
       productElement.addEventListener('click', function () {
        const productId = productElement.dataset.id;  // Get the unique product ID
        if (productId) {
          // Navigate to Description.html, passing the product ID as a query parameter
          window.location.href = ` ../../Pages/Description.html?id=${encodeURIComponent(productId)}`;
        } else {
          console.error('Product ID is missing!');
        }
      });

      
      });

      // Recalculate firstCardWidth after appending products
      const firstCard = carousel.querySelector('.card');
      const firstCardWidth = firstCard.offsetWidth;

      let isDragging = false,
        startX,
        startScrollLeft,
        timeoutId;

      // Dragging logic
      const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add('dragging');
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
      };

      const dragging = (e) => {
        if (!isDragging) return;

        // Calculate the new scroll position
        const newScrollLeft = startScrollLeft - (e.pageX - startX);

        // Check if the new scroll position exceeds the carousel boundaries
        if (newScrollLeft <= 0 || newScrollLeft >= carousel.scrollWidth - carousel.offsetWidth) {
          // If so, prevent further dragging
          isDragging = false;
          return;
        }

        // Otherwise, update the scroll position of the carousel
        carousel.scrollLeft = newScrollLeft;
      };

      const dragStop = () => {
        isDragging = false;
        carousel.classList.remove('dragging');
      };

      const autoPlay = () => {
        // Return if window is smaller than 800
        if (window.innerWidth < 800) return;

        // Calculate the total width of all cards
        const totalCardWidth = carousel.scrollWidth;

        // Calculate the maximum scroll position
        const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

        // If the carousel is at the end, stop autoplay
        if (carousel.scrollLeft >= maxScrollLeft) return;

        // Autoplay the carousel after every 2500ms
        timeoutId = setTimeout(() =>
          carousel.scrollLeft += firstCardWidth, 2500);
      };

      // Event listeners for dragging
      carousel.addEventListener('mousedown', dragStart);
      carousel.addEventListener('mousemove', dragging);
      document.addEventListener('mouseup', dragStop);
      wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
      wrapper.addEventListener('mouseleave', autoPlay);

      // Event listeners for the arrow buttons
      arrowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          carousel.scrollLeft += btn.id === 'left' ? -firstCardWidth : firstCardWidth;
        });
      });
    })
    .catch(error => console.error('Error fetching the JSON:', error));




});

