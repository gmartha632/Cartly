
      import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
      import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
      import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

      // Web app's Firebase configuration
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
      const analytics = getAnalytics(app);
      const auth = getAuth(); // Firebase Authentication
      const db = getFirestore(app); // Firestore Database

      // DOM elements
      const form = document.getElementById("form");
      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const Cpassword = document.getElementById("C_password");

      // Form submission handler
      form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        if (validateInputs()) {
          const usernameVal = username.value.trim();
          const emailVal = email.value.trim();
          const passwordVal = password.value.trim();

          // Create user with email and password using Firebase Authentication
          createUserWithEmailAndPassword(auth, emailVal, passwordVal)
            .then(async (userCredential) => {
              const user = userCredential.user;
              console.log("User signed up:", user);
              window.location.href="../Html/dashbaord.html"
              // Save additional details (username) to Firestore
              try {
                await setDoc(doc(db, "users", user.uid), {
                  username: usernameVal,
                  email: emailVal,
                  createdAt: new Date(),
                });
                console.log("User details saved to Firestore");

                // Redirect the user to Homepage.html after successful registration
                alert("Registration successful! Please check your email for verification.");
                window.location.href="../Html/Homepage.html"
              } catch (error) {
                console.error("Error saving user details to Firestore:", error);
                alert("Error saving user details: " + error.message);
              }
            })
            .catch((error) => {
              console.error("Error signing up:", error);
              alert("Error: " + error.message); // Display error message
            });
        }
      });

      // Clear error
      username.addEventListener("input", () => clearError(username));
      email.addEventListener("input", () => clearError(email));
      password.addEventListener("input", () => clearError(password));
      Cpassword.addEventListener("input", () => clearError(Cpassword));

      // Input validation function
      function validateInputs() {
        const usernameVal = username.value.trim();
        const emailVal = email.value.trim();
        const passwordVal = password.value.trim();
        const CpasswordVal = Cpassword ? Cpassword.value.trim() : "";

        let success = true;

        // Username validation
        if (usernameVal === "") {
          success = false;
          setError(username, "Username is required");
        } else {
          setSuccess(username);
        }

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

        // Confirm password validation
        if (CpasswordVal === "") {
          success = false;
          setError(Cpassword, "Confirm Password is required");
        } else if (CpasswordVal !== passwordVal) {
          success = false;
          setError(Cpassword, "Password does not match");
        } else {
          setSuccess(Cpassword);
        }

        return success; // Return true if all fields are valid
      }

      // Helper function to display error messages
      function setError(element, message) {
        const inputGroup = element.parentElement;
        const errorElement = inputGroup.querySelector(".error");
        errorElement.innerText = message;
      }

      // Helper function to clear error messages
      function setSuccess(element) {
        const inputGroup = element.parentElement;
        const errorElement = inputGroup.querySelector(".error");
        errorElement.innerText = "";
      }

      // Helper function to clear error messages
      function clearError(element) {
        const inputGroup = element.parentElement;
        const errorElement = inputGroup.querySelector(".error");
        errorElement.innerText = "";
      }

      // Email validation regex
      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
   
