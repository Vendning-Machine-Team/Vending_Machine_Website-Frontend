import { checkAdminActive, updateActivity } from '/src/js/util.js';
const confirmButton = document.getElementById('confirmButton');
const homeButton = document.getElementById('homeButton');
const inventoryCount = document.getElementById('inventory_count');
const productPrice = document.getElementById('product_price');
const currentInventoryText = document.getElementById('currentInventory');
const currentPriceText = document.getElementById('currentPrice');
const productSelect = document.getElementById("productSelect");
//added the new button 
const addItemButton = document.getElementById('addItemButton');
const removeItemButton = document.getElementById("removeItemButton");

const username = localStorage.getItem('adminUsername');

if (!localStorage.getItem('adminUsername')) {
    window.location.replace('./adminLogin.html');
}

setInterval(checkAdminActive, 2 * 60 * 1000); // Check every 2 minutes
checkAdminActive(); // Initial check on page load

function calculateTotal() {
    const count = inventoryCount.value;
    const price = productPrice.value;
    const total = count * price;
    document.getElementById('total').innerText = `$${total}`;
    //loadData();
}

//this function will need to be done later to update to the database. i dont think it was actually doing anything
function updateInventory() {

    const count = inventoryCount.value;
    const price = productPrice.value;
    const productId = productSelect.value;

    fetch("/api/update-inventory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            product_id: productId,
            inventory: count,
            price: price,
            username:username
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadData();
    });
}

function loadData(){
    //get the current inventory and price for hte selected product
    const productId = productSelect.value;

    fetch(`/api/get-inventory/${productId}`)
        .then(response => response.json())
        .then(data => {
            currentInventoryText.innerText = `Current Inventory: ${data.inventory}`;
            currentPriceText.innerText = `Current Price: $${data.price}`;

            inventoryCount.value = data.inventory;
            productPrice.value = data.price;
        });
}

function loadProducts() {
    fetch("/api/get-products")
        .then(res => res.json())
        .then(products => {

            productSelect.innerHTML = "";

            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });

            loadData(); // load first product automatically
        });
}


inventoryCount.addEventListener("input", calculateTotal);
productPrice.addEventListener("input", calculateTotal);

confirmButton.addEventListener('click', () => {
    alert("Successfully changed inventory")
    updateActivity();
    updateInventory();
    console.log('Confirm button clicked');
});

homeButton.addEventListener('click', () => {
    window.location.replace("./adminDashboard.html");
    updateActivity();
    console.log('Home button clicked');
});

productSelect.addEventListener("change", () => {
    loadData();
});


addItemButton.addEventListener("click", () => {
  // dark background overlay
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4";

  // popup box
  const modal = document.createElement("div");
  modal.className =
    "bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-8 w-full max-w-md space-y-5";

  modal.innerHTML = `
    <h2 class="text-2xl font-semibold text-gray-900 text-center">Add Product</h2>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
      <input
        id="productNameInput"
        type="text"
        placeholder="Enter product name"
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 text-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
      <input
        id="productPriceInput"
        type="number"
        step="0.01"
        min="0"
        placeholder="Enter price"
        class="w-full px-4 py-3 rounded-2xl border border-gray-200 text-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
      />
    </div>

    <div class="flex gap-3 pt-2">
      <button
        id="cancelAddItem"
        type="button"
        class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-2xl font-semibold transition"
      >
        Cancel
      </button>

      <button
        id="submitAddItem"
        type="button"
        class="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-3 rounded-2xl font-semibold transition"
      >
        Enter
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const productNameInput = document.getElementById("productNameInput");
  const productPriceInput = document.getElementById("productPriceInput");
  const cancelAddItem = document.getElementById("cancelAddItem");
  const submitAddItem = document.getElementById("submitAddItem");

  productNameInput.focus();

  cancelAddItem.addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

    submitAddItem.addEventListener("click", async () => {
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);

    if (!name || isNaN(price) || price < 0) {
      alert("Please enter a valid product name and price.");
      return;
    }

    const newProduct = {
      name,
      price,
    };

    try {
      const res = await fetch("/api/add-product", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_product_name: newProduct.name,
          new_product_price: newProduct.price,
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      overlay.remove();
      loadProducts();
      calculateTotal();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Could not add product.");
    }
  });
}); // closes addItemButton listener


removeItemButton.addEventListener("click", async () => {
  const productId = productSelect.value;
  const productName = productSelect.options[productSelect.selectedIndex]?.text;

  if (!productId) {
    alert("Please select a product to remove.");
    return;
  }

  const confirmed = confirm(`Are you sure you want to remove "${productName}"?`);
  if (!confirmed) return;

  try {
    const res = await fetch("/api/remove-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
      }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Could not remove product");
    }

    alert("Product removed successfully.");
    loadProducts();
    calculateTotal();
  } catch (error) {
    console.error("Error removing product:", error);
    alert("Could not remove product.");
  }
});

loadProducts();
calculateTotal();