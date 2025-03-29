import { addFavItem } from "./favourite.js";

window.addFavItemFromCart = function (id, imgSrc) {
    addFavItem(id, imgSrc);
};


import { db } from "./firebaseAuth.js";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const cartItemContainer = document.querySelector('.cartItem');

const carDetails = [
    "This car features a powerful turbocharged engine, delivering exceptional horsepower and torque while maintaining excellent fuel efficiency.",
    "Designed for both performance and comfort, this vehicle boasts an advanced all-wheel-drive system, adaptive cruise control, and a dynamic sport mode.",
    "A perfect blend of power and efficiency, this imported car is equipped with a high-performance hybrid engine, offering an eco-friendly yet exhilarating driving experience.",
    "Built for those who seek adventure, this SUV comes with a robust 4x4 drivetrain, hill descent control, and a reinforced chassis for off-road capability.",
    "Experience unmatched luxury with this premium sedan, featuring a handcrafted leather interior, climate-controlled seating, and a high-fidelity surround sound system.",
    "This electric car redefines innovation with its cutting-edge battery technology, providing an extended driving range and rapid charging capabilities."
];

// Fetch Cart Items from Firestore
async function fetchCartItems() {
    if (!cartItemContainer) return;
    cartItemContainer.innerHTML = '';

    try {
        const cartRef = collection(db, 'cart');
        const snapshot = await getDocs(cartRef);
        let cartItems = [];

        if (snapshot.empty) {
            cartItemContainer.innerHTML = `<p class="text-center text-gray-500">Your cart is empty.</p>`;
            calculateTotal(cartItems); // Set total to $0 when cart is empty
            return;
        }

        snapshot.forEach((docSnap) => {
            let item = docSnap.data();
            cartItems.push({ ...item, id: docSnap.id });

            let randomDetail = carDetails[Math.floor(Math.random() * carDetails.length)];

            cartItemContainer.innerHTML += `
                <div class="cart-entry" id="cart-item-${docSnap.id}">
                    <div class="item mx-4 sm:mx-6 md:mx-10 lg:mx-36 h-auto shadow-2xl my-2 flex">
                    <div class="w-[150px] h-[150px] md:w-[250px] md:h-[200px] lg:w-[300px] lg:h-[250px] overflow-hidden flex items-center justify-center bg-gray-100">
                        <img 
                            class="w-full h-full object-cover rounded-xl"
                            src="${item.imgSrc}" 
                            alt="${item.naam}"
                        onerror="this.onerror=null; this.src='path-to-fallback-image.jpg';" 
                        />
                    </div>                        
                    <div class="mx-3 md:mx-5 lg:mx-[30px]">
                            <h1 class="sm:font-semibold md:font-semibold lg:font-bold sm:text-xl md:text-2xl lg:text-3xl ">${item.naam}</h1>
                            <p class="text-[10px] md:text-[12px] lg:text-[14px] max-w-[800px] sm:max-w-auto md:max-w-[200px] lg:max-w-[800px] leading-3 lg:leading-4 sm:my-0.5 md:my-1 lg:my-1.5">${randomDetail}</p>
                            <h1 class="sm:font-semibold md:font-semibold lg:font-medium sm:text-[12px] md:text-[16px]  text-red-500">$ ${item.price}</h1>
                            <span class="flex justify-between">
                                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                    <button onclick="changeCount('${docSnap.id}', 'minus')" 
                                        class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 transition-colors">
                                        <span class="font-bold">−</span>
                                    </button>
                                    <p class="w-10 py-2 text-center font-medium" id="quantity-${docSnap.id}">${item.numberOfUnit}</p>
                                    <button onclick="changeCount('${docSnap.id}', 'plus')" 
                                        class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 transition-colors">
                                        <span class="font-bold">+</span>
                                    </button>
                                </div>
                                <span>
                                    <button onclick="deleteItem('${docSnap.id}')" class="w-12  md:w-18 lg:w-36 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] md:text-sm lg:text-base py-1 md:py-2 lg:py-3 rounded-lg cursor-pointer m-1">Delete</button>
                                    <button onclick="addFavItemFromCart('${docSnap.id}', '${item.imgSrc}')" class="w-28 md:w-36 lg:w-56 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] md:text-[14px] lg:text-[16px] py-1 md:py-2 lg:py-3 px-4 rounded-lg cursor-pointer">Add to Favorite</button>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });

        // Update total after fetching items
        calculateTotal(cartItems);

    } catch (error) {
        cartItemContainer.innerHTML = `<p class="text-red-500">Error loading cart items.</p>`;
    }
}

// Change Quantity
window.changeCount = async function (itemId, action) {
    try {
        const cartItemRef = doc(db, "cart", itemId);
        const snapshot = await getDocs(collection(db, "cart"));

        let item = snapshot.docs.find(docSnap => docSnap.id === itemId);
        if (!item) return;

        let currentData = item.data();
        let newQuantity = action === "plus" ? currentData.numberOfUnit + 1 : currentData.numberOfUnit - 1;

        if (newQuantity > 0) {
            await updateDoc(cartItemRef, { numberOfUnit: newQuantity });

            // Update UI without reloading
            let quantityElement = document.getElementById(`quantity-${itemId}`);
            if (quantityElement) {
                quantityElement.innerText = newQuantity;
            }

            // Update total after changing quantity
            fetchCartItems();
        }
    } catch (error) {
        Swal.fire("Error updating quantity", error.message);
    }
};

// Calculate Total Price
function calculateTotal(cartItems) {
    let totalAmount = 0;

    cartItems.forEach(item => {
        totalAmount += item.numberOfUnit * item.price;
    });

    const totalContainer = document.getElementById('total');
    if (totalContainer) {
        totalContainer.innerHTML = `
            <span class="flex justify-between items-center text-xl md:text-2xl lg:text-3xl font-bold gap-4 lg:gap-6 ">
                <div>Total :</div>
                <div class="">$${totalAmount.toFixed(2)}</div>
            </span>
        `;
    }
}

// Delete Item from Cart
window.deleteItem = async function (itemId) {
    try {
        await deleteDoc(doc(db, "cart", itemId));
        Swal.fire("Item removed from cart");
        fetchCartItems(); // Refresh the cart
    } catch (error) {
        Swal.fire("Error deleting item", error.message);
    }
};

// Check if cart is empty before checkout
document.getElementById("checkout").addEventListener("click", async function (event) {
    try {
        const cartRef = collection(db, 'cart');
        const snapshot = await getDocs(cartRef);

        if (snapshot.empty) {
            event.preventDefault();
            Swal.fire({
                icon: "warning",
                title: "Cart is empty!",
                text: "Please add items to your cart before checking out.",
            });
        } else {
            window.location.href = "checkout.html";
        }
    } catch (error) {
        console.error("Error checking cart:", error);
    }
});



document.addEventListener("DOMContentLoaded", fetchCartItems);