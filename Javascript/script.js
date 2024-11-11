const form = document.getElementById("signupForm");
form.setAttribute("novalidate", true);
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

form.addEventListener("submit", function(event) {
  // Reset errors
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  
  if (!email.validity.valid) {
    if (email.validity.valueMissing) {
      emailError.textContent = "Email is required!";
    } else if (email.validity.typeMismatch) {
      emailError.textContent = "Please enter a valid email address!";
    }
    event.preventDefault();
  }

  if (!password.checkValidity()) {
    if (password.validity.valueMissing) {
      passwordError.textContent = "Password is required!";
    } else if (password.validity.tooShort) {
      passwordError.textContent = "Password must be at least 8 characters long!";
    }
    event.preventDefault();
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.textContent = "Passwords do not match!";
    event.preventDefault();
  }
});

password.addEventListener("input", function() {
  passwordError.textContent = "";
  if (password.validity.tooShort) {
    passwordError.textContent = `Password must be at least ${password.minLength} characters; you entered ${password.value.length}.`;
  }
});

confirmPassword.addEventListener("input", function() {
  confirmPasswordError.textContent = "";
  if (confirmPassword.value !== password.value) {
    confirmPasswordError.textContent = "Passwords do not match!";
  }
});