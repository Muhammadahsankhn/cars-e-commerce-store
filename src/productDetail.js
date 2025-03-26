import { db } from "./firebaseAuth.js";
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

async function fetchProducts() {
    try {
        const productRef = collection(db, 'products');
        const snapshot = await getDocs(productRef);
        let products = [];

        snapshot.forEach((doc) => {
            let productData = doc.data();
            products.push({
                id: doc.id,
                naam: productData.name,
                imgSrc: productData.imageURL,
                price: productData.price,
            });
        });

        renderProduct(products);

    } catch (error) {
        console.error('Products not found', error);
    }
};

function renderProduct(products) {
    const productDetails = document.querySelector('.productDetails');
    productDetails.innerHTML = products.map(item => `
       <div class="cart-entry" id="cart-item-${item.id}">
            <div class="item mx-36 h-auto shadow-2xl my-2 flex p-4 items-center">
                <img class="w-[800px] h-[500px] m-0 p-0" src="${item.imgSrc}" alt="${item.naam}" />
                <div class="items-center mx-[50px]">
                    <div>
                        <h1 class="font-bold text-2xl ">Name : ${item.naam}</h1>
                        <h1 class="font-medium text-2xl ">Price: $ ${item.price}</h1>
                    </div>
                    <div class="">
                       <button class="delete-btn w-36 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer " data-id="${item.id}">Delete</button>
                       <button class="delete-btn w-36 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer" data-id="${item.id}">Update</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id;
            await deleteProduct(productId);
        });
    });

}

async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(db, "products", productId));
        document.getElementById(`cart-item-${productId}`).remove();
        swal.fire(`Product ${productId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchProducts);
