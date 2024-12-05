let logout = document.getElementById("logout-button")


// logout function
logout.addEventListener("click",()=>{
    window.location.href = "../index.html"
})


let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const slidesToShow = 3; // Display 3 slides at a time
const totalSlidesToDisplay = totalSlides - slidesToShow;

function moveSlide(step) {
    currentIndex += step;

    // If the current index exceeds the bounds, reset to the beginning or end to create a loop
    if (currentIndex < 0) {
        currentIndex = totalSlidesToDisplay;  // Loop to the last group
    } else if (currentIndex > totalSlidesToDisplay) {
        currentIndex = 0;  // Loop to the first group
    }

    // Move the carousel by modifying the transform property
    document.querySelector('.carousel').style.transform = `translateX(-${currentIndex * (100 / slidesToShow)}%)`;
}

