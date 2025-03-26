import { db } from "./firebaseAuth.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Auth Reference
const auth = getAuth();

// Select the Logout Button
const logoutBtn = document.querySelector(".logout-btn"); 

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            // Sign out from Firebase
            await signOut(auth);

            // Clear session storage & local storage
            sessionStorage.clear();
            localStorage.clear();

            // Redirect to index.html
            window.location.href = "index.html";

            // Close all other open pages (Only works if they were opened via script)
            window.open('', '_self', '');
            window.close();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    });
}





const productEl = document.getElementById('product-row');

// Fetch Products from Firestore
async function fetchProducts() {
    try {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        let products = [];

        if (snapshot.empty) {
            productEl.innerHTML = `<p class="text-center text-gray-500 text-lg">No products available.</p>`;
            return;
        }

        snapshot.forEach((doc) => {
            let productData = doc.data();
            products.push({
                id: doc.id,
                naam: productData.name,
                imgSrc: productData.imageURL,
                price: productData.price,
                numberOfUnit: productData.numberOfUnit || 1
            });
        });

        renderProduct(products);
        return products;
    } catch (error) {
        productEl.innerHTML = `<p class="text-center text-red-500 text-lg">Error loading products.</p>`;
    }
}

// Render Products on Index Page
function renderProduct(productToRender) {
    productEl.innerHTML = "";

    productToRender.forEach((item) => {
        const productHTML = `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden p-4 transform transition duration-300 hover:scale-105">
                <div class="h-48 overflow-hidden rounded-md">
                    <img src="${item.imgSrc}" alt="${item.naam}" class="w-full h-full object-cover">
                </div>
                <div class="text-center py-4">
                    <h3 class="text-lg font-semibold text-gray-800">${item.naam}</h3>
                    <p class="text-red-600 font-bold text-lg">$${item.price.toLocaleString()}</p>
                </div>
                <button onclick="addtoCart('${item.id}', '${item.naam}', '${item.imgSrc}', ${item.price})"
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Add to Cart
                </button>
            </div>
        `;
        productEl.innerHTML += productHTML;
    });
}

document.addEventListener("DOMContentLoaded", fetchProducts);

window.addtoCart = async function (id, naam, imgSrc, price) {
    const cartRef = collection(db, 'cart');

    try {
        const q = query(cartRef, where('naam', '==', naam));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            Swal.fire("Product already exists in the cart!");
            return;
        }

        const newCartItem = {
            id: id,
            naam: naam,
            price: price,
            imgSrc: imgSrc,
            numberOfUnit: 1
        };

        await addDoc(cartRef, newCartItem);
        Swal.fire('Product added to cart!');

    } catch (error) {
        Swal.fire('Error adding to cart', error.message);
    }
};





async function filterProduct() {
    const filterBtn = document.getElementById('FilterBtn');

    if (!filterBtn) return;

    filterBtn.addEventListener('click', async () => {
        const minPrice = parseFloat(document.getElementById('min').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max').value) || Infinity;

        const allProducts = await fetchProducts(); // 
        const filteredProducts = allProducts.filter(item => item.price >= minPrice && item.price <= maxPrice);

        renderProduct(filteredProducts); // 

        // Clear input fields
        document.getElementById('min').value = "";
        document.getElementById('max').value = "";
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    const products = await fetchProducts(); 
    filterProduct(); 
});







function addProducts() {
    const addForm = document.getElementById('form');
    addForm.classList.remove("hidden");
    addForm.classList.add("flex");
};

if (window.location.href === "http://127.0.0.1:5500/src/adminPannel.html") {
    document.getElementById('showModalButton').addEventListener('click', () => {
        addProducts()
    })

}
const addNewProduct = async () => {
    try {
        const imageURL = document.getElementById('imgURL').value;
        const name = document.getElementById('pName').value;
        const price = document.getElementById('pPrice').value;

        const colRef = collection(db, "products");
        await addDoc(colRef, { imageURL, name, price });


        Swal.fire("Product Added!");

    } catch (error) {
        console.error('Error in adding product in to the DB', error)
    }
}


if (window.location.href === "http://127.0.0.1:5500/src/adminPannel.html") {

    document.getElementById('productFormSubmitButton').addEventListener('click', async () => {
        await addNewProduct()
        document.getElementById('imgURL').value = '';
        document.getElementById('pName').value = '';
        document.getElementById('pPrice').value = '';
    });

}

document.addEventListener('DOMContentLoaded', async () => {
    if (productEl) {
        const productsRef = collection(db, "products"); // Reference the "products" collection
        const querySnapshot = await getDocs(productsRef);

        let productToRender = [];
        querySnapshot.forEach((doc) => {
            productToRender.push({ id: doc.id, imgSrc: doc.data().imageURL, naam: doc.data().name, price: doc.data().price }); // Add document ID and data
        });


        renderProduct(productToRender);
        
    }

    if (document.querySelector('.productDetails')) {
        renderProductDetails();
        addProducts();
    }
});