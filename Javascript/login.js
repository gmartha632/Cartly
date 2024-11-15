const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

// Add submit event listener to the form
form.addEventListener("submit", (event) => {
  if (!validateInputs()) {
    event.preventDefault(); // Prevent form submission if validation fails
  }
});

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

// Email validation r
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
