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
                    <div class="item mx-36 h-auto shadow-2xl my-2 flex">
                        <img class="w-[300px] h-[200px]" src="${item.imgSrc}" alt="${item.naam}" />
                        <div class="mx-[30px]">
                            <h1 class="font-bold text-3xl ">${item.naam}</h1>
                            <p class="text-[14px] w-[800px] leading-4 my-1.5">${randomDetail}</p>
                            <h1 class="font-medium text-xl text-red-500">$ ${item.price}</h1>
                            <span class="flex justify-between">
                                <span class="flex items-center">
                                    <button onclick="changeCount('${docSnap.id}', 'plus')" class="bg-red-600 hover:bg-red-700 rounded-full text-white font-bold px-2 cursor-pointer">+</button>
                                    <p class="mx-2 border-[0.1px] border-gray-400 p-1" id="quantity-${docSnap.id}">${item.numberOfUnit}</p>
                                    <button onclick="changeCount('${docSnap.id}', 'minus')" class="bg-red-600 hover:bg-red-700 rounded-full text-white font-bold px-2 cursor-pointer">-</button>
                                </span>
                                <span>
                                    <button onclick="deleteItem('${docSnap.id}')" class="w-36 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">Delete</button>
                                    <button onclick="addFavItemFromCart('${docSnap.id}', '${item.imgSrc}')" class="w-38 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">Add to favorite</button>
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
            <span class="flex justify-between items-center text-3xl font-bold gap-6 ">
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