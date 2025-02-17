import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
const database = getDatabase(app);


let isLoggedIn = localStorage.getItem("isLoggedIn");


onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("userId", user.uid);

  }
});

const fetchData = async () => {
  const dbRef = ref(database, "dashboard"); 
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val(); 
      displayData(data);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const displayData = (data) => {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
    
    dashboard.appendChild(card);
    card.addEventListener("click",()=>{
      localStorage.setItem("selectedCategory",item.name)
      window.location.href="../../Pages/Categories.html"
    })
  });
};

document.addEventListener("DOMContentLoaded", fetchData);


