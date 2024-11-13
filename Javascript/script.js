// Correctly reference the form and input elements by their IDs
const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

// Event listener for form submission
form.addEventListener("submit", (event) => {
  if (!validateInputs()) {
    event.preventDefault();  // Prevent form submission if validation fails
  }
});

// Function to validate inputs (email and password for login)
function validateInputs() {
  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();
  
  let success = true;

  // Email check
  if (emailVal === "") {
    success = false;
    setError(email, "Email is required");
  } else if (!validateEmail(emailVal)) {
    success = false;
    setError(email, "Please enter a valid email address");
  } else {
    setSuccess(email);
  }

  // Password check
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

// Function to set error message
function setError(element, message) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");

  errorElement.innerText = message;
}

// Function to set success (clear error message)
function setSuccess(element) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");

  errorElement.innerText = "";  // Clear any existing error messages
}

// Email validation regex
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
