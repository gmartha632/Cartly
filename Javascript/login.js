import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


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

const auth = getAuth(app);

// Get form and input elements
const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
// const errorElement = inputGroup.querySelector(".error");
const errorElement = document.getElementsByClassName("error");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission

  // Clear previous error messages
  setSuccess(email);
  setSuccess(password);

  if (validateInputs()) {
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();

    signInWithEmailAndPassword(auth, emailVal, passwordVal)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
        window.location.href = "../Html/dashboard.html"; // Redirect to dashboard
      })
      .catch((error) => {
        errorElement[2].textContent = "Enter valid Password or email";
        errorElement[2].style.display = "block";
        errorElement[2].style.color = "red";
      });
  }
});



// Form validation
function validateInputs() {
  let isValid = true;

  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();

  // Email validation
  if (emailVal === "") {
    setError(email, "Email is required");
    isValid = false;
  } else if (!validateEmail(emailVal)) {
    setError(email, "Please enter a valid email address");
    isValid = false;
  } else {
    setSuccess(email);
  }

  // Password validation
  if (passwordVal === "") {
    setError(password, "Password is required");
    isValid = false;
  } else if (passwordVal.length < 8) {
    setError(password, "Password must be at least 8 characters long");
    isValid = false;
  } else {
    setSuccess(password);
  }

  return isValid;
}

// Set error messages in span tag
function setError(element, message) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = message; // Show error in span tag
  element.classList.add("error-input"); // Add error style
}

// Clear error messages
function setSuccess(element) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = ""; // Clear error text
  element.classList.remove("error-input"); // Remove error style
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
