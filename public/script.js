
const form = document.getElementById("productForm");
const productList = document.getElementById("productList");

const productId = document.getElementById("productId");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");

const submitBtn = document.getElementById("submitBtn");

// Display all products
async function loadProducts() {

    const response = await fetch("/products");
    const products = await response.json();

    productList.innerHTML = "";

    products.forEach(product => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>₹${product.price}</td>
            <td>${product.category}</td>
            <td>
                <button class="edit"
                    onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button class="delete"
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>
            </td>
        `;

        productList.appendChild(row);
    });
}

// Add or update product
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const product = {
        name: nameInput.value,
        price: Number(priceInput.value),
        category: categoryInput.value
    };

    let url = "/products";
    let method = "POST";

    if (productId.value) {
        url = `/products/${productId.value}`;
        method = "PUT";
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    const result = await response.json();

    alert(result.message);

    if (response.ok) {
        form.reset();
        productId.value = "";
        submitBtn.textContent = "Add Product";
        loadProducts();
    }
});

// Edit product
async function editProduct(id) {

    const response = await fetch("/products");
    const products = await response.json();

    const product = products.find(p => p.id === id);

    if (product) {
        productId.value = product.id;
        nameInput.value = product.name;
        priceInput.value = product.price;
        categoryInput.value = product.category;

        submitBtn.textContent = "Update Product";
    }
}

// Delete product
async function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    const response = await fetch(`/products/${id}`, {
        method: "DELETE"
    });

    const result = await response.json();

    alert(result.message);

    if (response.ok) {
        loadProducts();
    }
}

// Load products when page opens
loadProducts();
