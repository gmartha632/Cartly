let logout = document.getElementById("logout-button")
// logout function
logout.addEventListener("click",()=>{
    window.location.href = "../index.html"
});


document.addEventListener('DOMContentLoaded', () => {
  // Fetch the JSON data from the external file
  fetch('../JSON/Products.json')
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
      const products = data.products; // Access the products array
      const carousel = document.querySelector('.carousel');
      const arrowBtns = document.querySelectorAll('.wrapper i');
      const wrapper = document.querySelector('.wrapper');

      // Append products to the carousel
      products.forEach(product => {
        const productElement = document.createElement('li');
        productElement.classList.add('card');
        
        productElement.innerHTML = `
          <div class="img">
            <img src="${product.image}" alt="${product.name}" draggable="false">
          </div>
          <h2>${product.name}</h2>
          <span>${product.price}</span>
        `;
        
        carousel.appendChild(productElement);
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

  


