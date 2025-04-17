// Assets/Script/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTj8qVmWz9kWq6wxuSCDYE3iljRQZTCFE",
  authDomain: "cartly-314cd.firebaseapp.com",
  projectId: "cartly-314cd",
  storageBucket: "cartly-314cd.firebasestorage.app",
  appId: "1:1075164553188:web:8e9a88d063d1541d8371f1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
