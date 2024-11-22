// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTj8qVmWz9kWq6wxuSCDYE3iljRQZTCFE",
  authDomain: "cartly-314cd.firebaseapp.com",
  projectId: "cartly-314cd",
  storageBucket: "cartly-314cd.firebasestorage.app",
  messagingSenderId: "1075164553188",
  appId: "1:1075164553188:web:8e9a88d063d1541d8371f1",
  measurementId: "G-4LPYG75NPM"
};

// Initialize Firebase and Analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(); // Firebase Authentication instance

// Get DOM elements
const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

// Add submit event listener to the form
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the form from submitting immediately

  if (validateInputs()) {
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();

    // Attempt to sign in with Firebase Authentication
    signInWithEmailAndPassword(auth, emailVal, passwordVal)
      .then((userCredential) => {
        // Successful login
        const user = userCredential.user;
        console.log("User logged in:", user);
        // Redirect to dashboard or another page upon success
        window.location.href="../Html/Homepage.html"
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Login error:", errorCode, errorMessage);
        alert("Login failed: " + errorMessage); // Show the error to the user
      });
  }
});

// Form validation function
function validateInputs() {
  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();
  let success = true;

  // Email validation
  if (emailVal === "") {
    success = false;
    setError(email, "Email is required");
  } else if (!validateEmail(emailVal)) {
    success = false;
    setError(email, "Please enter a valid email address");
  } else {
    setSuccess(email);
  }

  // Password validation
  if (passwordVal === "") {
    success = false;
    setError(password, "Password is required");
  } else if (passwordVal.length < 8) {
    success = false;
    setError(password, "Password must be at least 8 characters long");
  } else {
    setSuccess(password);
  }

  return success;
}

// Error handling functions
function setError(element, message) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = message;
}

function setSuccess(element) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = "";
}

// Email validation regular expression
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
