import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
console.log("Firebase Initialized:", app);

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return; // Prevents errors if div does not exist

  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const auth = getAuth();
const db = getFirestore();


const signup = document.getElementById('signupbtn');
signup.addEventListener('click', (event) => {
  event.preventDefault();

  const firstName = document.getElementById('fname').value.trim();
  const lastName = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();


  if (password.length < 6) {
    showMessage('Password must be at least 6 characters long!', 'signupMessage');
    return; // Stop execution
  };

  localStorage.clear();



  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      const userData = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: 'user'
      };



      showMessage("Account created successfully", "signupMessage");

      const docRef = doc(db, "users", user.uid);
      return setDoc(docRef, userData);
    })
    .then(() => {
      document.getElementById('email').value = "";
      document.getElementById('password').value = "";
      document.getElementById('fname').value = "";
      document.getElementById('lname').value = "";

      window.location.href = "product.html";
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        showMessage('Email address already exists!', 'signupMessage');
      } else {
        showMessage('Unable to create user!', 'signupMessage');
      }
      console.error("Error writing document:", error);
    });
});

const loginButton = document.getElementById('logBtn');
loginButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('lemail').value.trim();
  const password = document.getElementById('lpassword').value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showMessage('Login is successful', 'signInMessage');

    const user = userCredential.user;
    localStorage.setItem('loggedInUserId', user.uid);
    
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User Data from Firestore:", userData);  

      if (userData.role === "admin") {
        window.location.href = 'adminPannel.html';
      } else {
        window.location.href = 'product.html';
      }
    } else {
      showMessage("User data not found in Firestore!", "signInMessage");
    }
  } catch (error) {
    console.error("Login Error:", error); 

    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      showMessage('Incorrect Email or Password', 'signInMessage');
    } else if (error.code === 'auth/too-many-requests') {
      showMessage('Too many failed attempts. Try again later.', 'signInMessage');
    } else {
      showMessage('Login failed: ' + error.message, 'signInMessage');
    }
  } finally {
    document.getElementById('lemail').value = "";
    document.getElementById('lpassword').value = "";
  }
});
