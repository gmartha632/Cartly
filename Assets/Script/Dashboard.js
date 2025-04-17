import { database } from "./firebaseConfig.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const fetchData = async () => {
  const dbRef = ref(database, "dashboard");
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      displayData(snapshot.val());
    } else {
      console.log("No dashboard data");
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

const displayData = (data) => {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = "";
  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("selectedCategory", item.name);
      window.location.href = "../../Pages/Categories.html";
    });
    dashboard.appendChild(card);
  });
};

document.addEventListener("DOMContentLoaded", fetchData);
  