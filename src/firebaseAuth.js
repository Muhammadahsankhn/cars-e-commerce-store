import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7ZDZZXX6-Kcedd4Q9lJiTvGW8m7O7TV4",
  authDomain: "form-b875d.firebaseapp.com",
  projectId: "form-b875d",
  storageBucket: "form-b875d.firebasestorage.app",
  messagingSenderId: "1082675063281",
  appId: "1:1082675063281:web:e77ba1f390e5fafbd8bc50",
  measurementId: "G-XR49R0TBBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return;

  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

//  Function to clear Cart & Favorites in Firestore
async function clearUserCartAndFavorites() {
  try {
    const cartRef = collection(db, "cart");
    const favRef = collection(db, "favorites");

    const cartSnapshot = await getDocs(cartRef);
    const favSnapshot = await getDocs(favRef);

    // Delete all cart items
    cartSnapshot.forEach(async (item) => {
      await deleteDoc(doc(db, "cart", item.id));
    });

    // Delete all favorite items
    favSnapshot.forEach(async (item) => {
      await deleteDoc(doc(db, "favorites", item.id));
    });

    console.log("Cart and favorites cleared from Firestore.");
  } catch (error) {
    console.error("Error clearing cart and favorites:", error);
  }
}

//  Signup Logic
if (window.location.pathname !== "/src/adminPannel.html" && window.location.pathname !== "/src/product.html") {
  const signup = document.getElementById("signupbtn");

  if (signup) {
    signup.addEventListener("click", async (event) => {
      event.preventDefault();

      const firstName = document.getElementById("fname").value.trim();
      const lastName = document.getElementById("lname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (password.length < 6) {
        showMessage("Password must be at least 6 characters long!", "signupMessage");
        return;
      }

      //  Clear Local Storage
      localStorage.clear();

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);

        const userData = {
          email,
          password,
          firstName,
          lastName,
          role: "user",
        };

        showMessage("Account created successfully", "signupMessage");

        await setDoc(doc(db, "users", user.uid), userData);

        //  Clear Cart and Favorites in Firestore
        await clearUserCartAndFavorites();

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";

        window.location.href = "product.html";
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          showMessage("Email address already exists!", "signupMessage");
        } else {
          showMessage("Unable to create user!", "signupMessage");
        }
        console.error("Error writing document:", error);
      }
    });
  } else {
    console.warn("Signup button not found on this page.");
  }

  // Login Logic
  const loginButton = document.getElementById("logBtn");
  if (loginButton) {
    loginButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const email = document.getElementById("lemail").value.trim();
      const password = document.getElementById("lpassword").value.trim();

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showMessage("Login is successful", "signInMessage");

        const user = userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);

        //  Clear Local Storage
        localStorage.clear();

        //  Clear Cart and Favorites in Firestore
        await clearUserCartAndFavorites();

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "admin") {
            window.location.href = "adminPannel.html";
          } else {
            window.location.href = "product.html";
          }
        } else {
          showMessage("User data not found in Firestore!", "signInMessage");
        }
      } catch (error) {
        console.error("Login Error:", error);
        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          showMessage("Incorrect Email or Password", "signInMessage");
        } else if (error.code === "auth/too-many-requests") {
          showMessage("Too many failed attempts. Try again later.", "signInMessage");
        } else {
          showMessage("Login failed: " + error.message, "signInMessage");
        }
      } finally {
        document.getElementById("lemail").value = "";
        document.getElementById("lpassword").value = "";
      }
    });
  } else {
    console.warn("Login button not found on this page.");
  }
}

export { db };
