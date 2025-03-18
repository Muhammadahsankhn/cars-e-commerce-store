import { db } from "./firebaseAuth.js";
import { collection,addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const products = [
    {
        id: 1,
        imgSrc: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: "Mercedez Benz Amg",
        price: 320000
    },
    {
        id: 2,
        imgSrc: 'https://images.pexels.com/photos/17590537/pexels-photo-17590537/free-photo-of-a-red-mercedes-benz-gt-s-on-a-parking-lot.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'Mercedes-Benz GT S',
        price: 350000
    },
    {
        id: 3,
        imgSrc: 'https://images.pexels.com/photos/4639907/pexels-photo-4639907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'Land Rover Range Rove',
        price: 380000
    }, {
        id: 4,
        imgSrc: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'Land Rover Range Rover Suv ',
        price: 400000
    }, {
        id: 5,
        imgSrc: 'https://images.pexels.com/photos/100650/pexels-photo-100650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: ' BMW Sedan',
        price: 420000
    }, {
        id: 6,
        imgSrc: 'https://images.pexels.com/photos/6597518/pexels-photo-6597518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'BMW M5',
        price: 440000
    }, {
        id: 7,
        imgSrc: 'https://images.pexels.com/photos/12882894/pexels-photo-12882894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'Lamborghini Aventador',
        price: 550000
    }, {
        id: 8,
        imgSrc: 'https://images.pexels.com/photos/29603045/pexels-photo-29603045/free-photo-of-sleek-blue-lamborghini-urus-front-view-in-urban-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'Lamborghini Urus',
        price: 600000
    }, {
        id: 9,
        imgSrc: 'https://images.pexels.com/photos/7813160/pexels-photo-7813160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'McLaren F1 LM',
        price: 620000
    }, {
        id: 10,
        imgSrc: 'https://images.pexels.com/photos/18167337/pexels-photo-18167337/free-photo-of-black-audi-car.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        naam: 'Audi a5',
        price: 400000
    },
    {
        id: 11,
        imgSrc: 'https://tse2.mm.bing.net/th?id=OIP.UxHug9E96H7jy8bItL-v3wHaEK&pid=Api&P=0&h=220',
        naam: "Accord",
        price: 450000,
    },
    {
        id: 12,
        imgSrc: 'https://tse1.mm.bing.net/th?id=OIP.hw58LhOVhdrMeogqh9UtmwHaE8&pid=Api&P=0&h=220',
        naam: "Camry",
        price: 230000,
    },
    {
        id: 13,
        imgSrc: 'https://tse3.mm.bing.net/th?id=OIP.cJ4ec59EhnSUR06kigaCMQHaEo&pid=Api&P=0&h=220',
        naam: "Fusion",
        price: 1789000,
    },
    {
        id: 14,
        imgSrc: 'https://tse1.mm.bing.net/th?id=OIP.3ic5KIFAKZfwuTmlW6giBQHaEK&pid=Api&P=0&h=220',
        naam: "Mustang",
        price: 1789000,
    },
    {
        id: 15,
        imgSrc: 'https://tse3.mm.bing.net/th?id=OIP.Te0rFzvINRzqNbNBPuxt0AHaEK&pid=Api&P=0&h=220',
        naam: "Explorer",
        price: 1789000,
    },
    {
        id: 16,
        imgSrc: 'https://tse1.mm.bing.net/th?id=OIP.T_QkgBkAt4WXOlQlavgw4QHaEo&pid=Api&P=0&h=220',
        naam: "Escape",
        price: 1789000,
    }
];

const productEl = document.getElementById('product-row');
const FilterBtn = document.getElementById('FilterBtn');
const total1 = document.getElementById('total');
let cartItem = document.querySelector('.cartItem');






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
                <button onclick="addtoCart(${item.id}, '${item.naam}', '${item.imgSrc}', ${item.price},'${item.numberOfUnit}')"
                    id='addToCartBtn'
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Add to Cart
                </button>
            </div>
        `;
        productEl.innerHTML += productHTML;
    });
}
// document.addEventListener('DOMContentLoaded', renderProduct)
// document.addEventListener('DOMContentLoaded', () => renderProduct(products));
function filterProduct() {
    FilterBtn.addEventListener('click', () => {

        const minPrice = parseFloat(document.getElementById('min').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max').value) || Infinity;

        const filteredProducts = products.filter(item => item.price >= minPrice && item.price <= maxPrice);

        renderProduct(filteredProducts)

        document.getElementById('min').value = "";
        document.getElementById('max').value = "";

    })
}









let cart = JSON.parse(localStorage.getItem('cart')) || [];
function addtoCart(id, naam, imgSrc, price) {
    const itemExist = cart.find(item => item.id === id);
    if (itemExist) {
        Swal.fire("Product alredy Exists")
        return
    }

    const carDetails = [
        "This car features a powerful turbocharged engine, delivering exceptional horsepower and torque while maintaining excellent fuel efficiency. The advanced suspension system ensures a smooth ride, even on rough terrains. Inside, the luxurious leather seating and ambient lighting create a premium driving experience, complemented by a state-of-the-art infotainment system with Apple CarPlay and Android Auto.",
        "Designed for both performance and comfort, this vehicle boasts an advanced all-wheel-drive system, adaptive cruise control, and a dynamic sport mode. The aerodynamic body enhances speed and stability, while the high-resolution touchscreen navigation system keeps you connected. Safety features include lane departure warning, blind-spot monitoring, and emergency braking assistance.",
        "A perfect blend of power and efficiency, this imported car is equipped with a high-performance hybrid engine, offering an eco-friendly yet exhilarating driving experience. The spacious interior is designed with ergonomic seating, premium sound insulation, and a panoramic sunroof for a refined travel experience. Smart driving features like automated parking assist and real-time traffic updates ensure effortless commuting.",
        "Built for those who seek adventure, this SUV comes with a robust 4x4 drivetrain, hill descent control, and a reinforced chassis for off-road capability. The interior is packed with modern tech, including a digital cockpit display, heated seats, and wireless charging. Enhanced safety features such as multiple airbags, collision avoidance, and a rearview camera make every journey secure and comfortable.",
        "Experience unmatched luxury with this premium sedan, featuring a handcrafted leather interior, climate-controlled seating, and a high-fidelity surround sound system. The twin-turbocharged engine delivers impressive acceleration, while the adaptive suspension provides a smooth and controlled ride. The latest AI-powered driver-assist system enhances safety and convenience on long drives.",
        "This electric car redefines innovation with its cutting-edge battery technology, providing an extended driving range and rapid charging capabilities. The minimalist yet futuristic interior features a fully digital dashboard, voice-activated controls, and a large touchscreen display. Advanced regenerative braking, autopilot functionality, and smart energy management make this car a leader in sustainable mobility."
    ];

    const newItems = {
        id: id,
        naam: naam,
        price: price,
        imgSrc: imgSrc,
        numberOfUnit: 1,
        randomDetail: carDetails[Math.floor(Math.random() * carDetails.length)]
    };

    cart.push(newItems);

    localStorage.setItem('cart', JSON.stringify(cart));
    Swal.fire("Product Added!");
    renderCartItem();
}

function renderCartItem() {
    const cartItemContainer = document.querySelector('.cartItem'); // Ensure it's selected inside function

    if (!cartItemContainer) return; // Stop if cart section is not on the page
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemContainer.innerHTML = ''; // Clear previous content

    cart.forEach((item) => {

        cartItemContainer.innerHTML += `
            <div class="cart-entry">
                <div class="item mx-36 h-auto shadow-2xl my-2 flex " id="cart">
                    <img class="w-[300px] h-[200px]" src="${item.imgSrc}" alt="${item.naam}" />
                    <div class="mx-[30px]">
                        <h1 class="font-bold text-3xl  mb-6">${item.naam}</h1>
                        <p class="text-[14px] w-[800px] leading-5">${item.randomDetail}</p>
                        <span class="flex justify-between">
                            <span class="flex items-center">
                                <button onclick="changeCount(${item.id},'plus')" class="bg-red-600 hover:bg-red-700 rounded-full  text-white  font-bold px-2 text-center items-center cursor-pointer">+</button>
                                <p class="mx-1">${item.numberOfUnit}</p>
                                <button onclick="changeCount(${item.id},'minus')" class="bg-red-600 hover:bg-red-700 rounded-full  text-white  font-bold px-2 text-center items-center cursor-pointer">-</button>
                            </span>
                            
                            <span>
                                <button onclick="deleteItem(${item.id})" class="w-36 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 cursor-pointer">Delete</button>
                                <button onclick="addFavItem(${item.id} , '${item.imgSrc}')" class="w-38 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 cursor-pointer">Add to favorite</button>
                            </span>        
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
};


function changeCount(id, action) {
    const item = cart.find((item) => item.id === id);
    if (item) {
        if (action === 'plus') {
            item.numberOfUnit++;
        } else if (action === 'minus' && item.numberOfUnit > 1) {
            item.numberOfUnit--;
        }
        localStorage.setItem('cart', JSON.stringify(cart))
        renderCartItem()
        total()
    }
}

function total() {
    let total = 0;
    cart.forEach((product) => {
        let subtotal = product.price * product.numberOfUnit;
        total += subtotal;
    })

    total1.innerHTML = `
        <div class="flex items-center justify-center text-3xl font-bold  ">Total : $${total.toFixed(2)}</div>
    `
}
// total();


function deleteItem(id) {
    const newCart = cart.filter((product) => product.id !== id);
    localStorage.setItem('cart', JSON.stringify(newCart));
    cart = newCart
    renderCartItem()
    total()
    Swal.fire("cart deleted")
}











let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let favContainer = document.querySelector('.FavItems');

function addFavItem(id, imgSrc) {

    const itemExist = favorites.find(item => item.id === id);
    if (itemExist) {
        Swal.fire("Already in favorites");
        return;
    }

    const newItem = {
        id, imgSrc
    };
    favorites.push(newItem);

    localStorage.setItem('favorites', JSON.stringify(favorites));
    Swal.fire("Added to Favorites!");
    renderFavorites();
}


function renderFavorites() {
    if (!favContainer) return;

    favContainer.innerHTML = "";
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach((item) => {
        favContainer.innerHTML += `
            <div class="cart-items w-[300px] h-auto mx-[50px]" id="favorites">
                <img class="w-[300px] h-[200px]" src="${item.imgSrc}" />
                <button class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 transition duration-300" onclick="removeFavItem(${item.id})">Remove</button>  
            </div>
        `;
    });
}


function removeFavItem(id) {
    const newFav = favorites.filter((product) => product.id !== id);
    localStorage.setItem('favorites', JSON.stringify(newFav));
    favorites = newFav;
    renderFavorites();
    Swal.fire("Remove from favorites..")
}














function renderProductDetails() {
    const productDetails = document.querySelector('.productDetails');

    productDetails.addEventListener('click', () => {
        console.log("haha");

    })

    products.forEach((item) => {
        productDetails.innerHTML += `
            <div class="cart-entry flex justify-center ">
                <div class="item mx-36 h-auto shadow-2xl my-2 flex" >
                    <img class="w-[850px] h-[500px] m-0 p-0" src="${item.imgSrc}" alt="${item.naam}" />
                    <div class="mx-[30px]">
                        <h1 class="font-black text-3xl  mt-42 ">${item.naam}</h1>
                        <p class="font-medium text-3xl  mb-6">Price :$${item.price}</p>
                    </div>
                </div>
            </div>
        `;

    });
};



function addProducts() {
    const addForm = document.getElementById('form');
    addForm.classList.remove("hidden");
    addForm.classList.add("flex");
};

document.getElementById('showModalButton').addEventListener('click', () => {
    addProducts()
})

const addNewProduct = async () => {
    try {
        const imageURL = document.getElementById('imgURL').value;
        const name = document.getElementById('pName').value;

        const colRef = collection(db, "products");
        await addDoc(colRef, {imageURL, name});


        Swal.fire("Product Added!");
    } catch (error) {
        console.log('Error in adding product in to the DB', error)
    }
}

document.getElementById('productFormSubmitButton').addEventListener('click', async () => {
    await addNewProduct()
});

document.addEventListener('DOMContentLoaded', () => {
    if (productEl) {
        renderProduct(products);
        filterProduct();

    }

    if (document.querySelector('.cartItem')) {
        renderCartItem();
        total()
    }

    if (document.querySelector('.FavItems')) {
        renderFavorites();
    }

    if (document.querySelector('.productDetails')) {
        renderProductDetails();
        addProducts();
    }
});