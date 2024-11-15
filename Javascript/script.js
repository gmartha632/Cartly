const form = document.getElementById("form");
let username = document.getElementById("username");

const email = document.getElementById("email");
const password = document.getElementById("password");
const Cpassword = document.getElementById("C_password");
form.addEventListener("submit", (event) => {
  if (!validateInputs()) {
    event.preventDefault();
  }
});

function validateInputs() {
  const usernameVal = username.value.trim();
   const emailVal = email.value.trim();
  const passwordVal = password.value.trim();
  const CpasswordVal = Cpassword ? Cpassword.value.trim() : "";
    success = true;
    if (usernameVal == "") {
      success = false;
      setError(username, "Username is required");
    } else {
      setSuccess(username);
    }
  
  

  if (emailVal === "") {
    success = false;
    setError(email, "Email is required");
  } else if (!validateEmail(emailVal)) {
    success = false;
    setError(email, "Please enter a valid email address");
  } else {
    setSuccess(email);
  }

  if (passwordVal === "") {
    success = false;
    setError(password, "Password is required");
  } else if (passwordVal.length < 8) {
    success = false;
    setError(password, "Password must be atleast 8 characters long");
  } else {
    setSuccess(password);
  }

 
  if (CpasswordVal === "") {
    success = false;
    setError(Cpassword, " Confirm Password is required");
  } else if (CpasswordVal !== passwordVal) {
    success = false;
    setError(Cpassword, "Password does not match");
  } else {
    setSuccess(Cpassword);
  }
 

  return success;
}

function setError(element, message) {
  const InputGroup = element.parentElement;
  const errorElement = InputGroup.querySelector(".error");
  errorElement.innerText = message;
}
function setSuccess(element) {
  const InputGroup = element.parentElement;
  const errorElement = InputGroup.querySelector(".error");
  errorElement.innerText = "";
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


