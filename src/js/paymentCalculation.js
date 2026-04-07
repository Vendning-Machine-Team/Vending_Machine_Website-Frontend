const payButton = document.getElementById('payButton');
const reportButton = document.getElementById('reportButton');
const totalText = document.getElementById("total");
const productContainer = document.getElementById("productContainer");

//these variables allow us to have multiple different products
let products = [];
//this cart keeps track of the quantity of reach product
let cart = {};

let total = 0;




async function loadProducts() {
    const response = await fetch("/api/products");
    products = await response.json();

    productContainer.innerHTML = "";

    products.forEach(product => {
        cart[product.id] = 0;

        const productImage = product.image_url
        console.log(productImage);

        const row = document.createElement("div");
        row.className = "bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center";
        
        row.innerHTML = `
            <img src="${productImage}" alt="${product.name}" class="w-28 h-28 object-cover rounded-lg mb-3">

            <p class="font-medium text-lg">${product.name}</p>
            <p class="text-sm text-gray-500">$${product.price}</p>
            <p class="text-xs text-gray-400 mb-3">${product.inventory} available</p>

            <input
                type="number"
                min="0"
                max="${product.inventory}"
                value="0"
                data-id="${product.id}"
                class="w-20 text-center border rounded-lg"
            >
        `;

        productContainer.appendChild(row);
    });

    addInputListeners();
    calculateTotal();
}

// Listen for quantity changes
function addInputListeners() {

    const inputs = document.querySelectorAll("input[data-id]");

    inputs.forEach(input => {

        input.addEventListener("input", () => {

            const id = input.dataset.id;
            const qty = parseInt(input.value) || 0;

            cart[id] = qty;

            calculateTotal();
        });

    });
}

// Calculate total price
function calculateTotal() {
    total = 0;
    products.forEach(product => {

        const qty = cart[product.id] || 0;
        total += qty * product.price;

    });
    
    totalText.innerText = `$${total}`;
    //prevents them from buying nothings
    payButton.disabled = total === 0;
}


reportButton.addEventListener("click", () => {
    window.location.replace("./pages/reportIssue.html");
});


//this currently points to a fake "stripe" session id this may need some slight changing in the future
payButton.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: cart   // send full cart
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Inventory issue. Try again.");
            loadProducts();
            return;
        }

        window.location.href = data.url;

    } catch (err) {
        console.error(err);
        alert("Something went wrong starting checkout.");
    }
});

loadProducts();