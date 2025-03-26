import { db } from "./firebaseAuth.js";
import { collection, doc, setDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";


// Ensure DOM is loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    renderFavorites(); // Load favorites on page load
});

let favContainer = document.querySelector('.FavItems'); // Ensure this exists

// Function to get favorites from localStorage
function getLocalFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Function to save favorites to localStorage
function saveToLocalFavorites(favItems) {
    localStorage.setItem("favorites", JSON.stringify(favItems));
}

// Add item to favorites (Firestore + LocalStorage)
async function addFavItem(id, imgSrc) {
    try {
        const favRef = doc(db, "favorites", id);

        // Get existing localStorage favorites
        let localFavorites = getLocalFavorites();

        // Check if item is already in favorites
        if (localFavorites.some(item => item.id === id)) {
            Swal.fire("Already in favorites!");
            return;
        }

        // Add to Firestore
        await setDoc(favRef, { id, imgSrc });

        // Add to localStorage
        localFavorites.push({ id, imgSrc });
        saveToLocalFavorites(localFavorites);

        Swal.fire("Added to Favorites!");
        renderFavorites(); // Refresh UI
    } catch (error) {
        console.error("Error adding to favorites:", error);
    }
}

// Render Favorites (Load from Firestore & LocalStorage)
async function renderFavorites() {
    if (!favContainer) return;
    favContainer.innerHTML = "";

    try {
        // Load from Firestore
        const snapshot = await getDocs(collection(db, "favorites"));
        let firestoreFavorites = snapshot.docs.map(doc => doc.data());

        // Load from localStorage
        let localFavorites = getLocalFavorites();

        // Merge both sources (avoid duplicates)
        let allFavorites = [...new Map([...firestoreFavorites, ...localFavorites].map(item => [item.id, item])).values()];

        if (allFavorites.length === 0) {
            favContainer.innerHTML = `<p class="text-center text-gray-500">No favorites added.</p>`;
            return;
        }

        allFavorites.forEach(item => {
            favContainer.innerHTML += `
                <div class="cart-items w-[300px] h-auto  mx-[50px] my-7" id="favorites">
                    <img class="w-[300px] h-[200px]" src="${item.imgSrc}" />
                    <button class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 transition duration-300" onclick="removeFavItem('${item.id}')">Remove</button>  
                </div>
            `;
        });

    } catch (error) {
        console.error("Error loading favorites:", error);
    }
}

// Remove Item from Favorites (Firestore + LocalStorage)
window.removeFavItem = async function(id) {
    try {
        // Remove from Firestore
        await deleteDoc(doc(db, "favorites", id));

        // Remove from localStorage
        let localFavorites = getLocalFavorites();
        localFavorites = localFavorites.filter(item => item.id !== id);
        saveToLocalFavorites(localFavorites);

        Swal.fire("Removed from favorites.");
        renderFavorites(); // Refresh UI
    } catch (error) {
        console.error("Error removing from favorites:", error);
    }
}

// Export function for external use
export { addFavItem };