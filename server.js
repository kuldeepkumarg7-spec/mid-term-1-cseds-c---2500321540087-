
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");

const app = express();


app.use(express.json());
app.use(express.static("public"));


const filePath = path.join(__dirname, "data", "products.json");


let products = [];

// Load products from JSON file
if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    products = JSON.parse(data);
}

// Save products to JSON file
function saveProducts() {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

// 1. GET - Display all products
app.get("/products", (req, res) => {
    res.json(products);
});

// 2. POST - Add a new product
app.post("/products", (req, res) => {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category ||
        !Number.isFinite(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Please enter valid product details"
        });
    }

    const newProduct = {
        id: products.length > 0
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name,
        price: Number(price),
        category
    };

    products.push(newProduct);
    saveProducts();

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// 3. PUT - Update a product
app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, price, category } = req.body;

    if (!name || price === undefined || !category ||
        !Number.isFinite(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Please enter valid product details"
        });
    }

    product.name = name;
    product.price = Number(price);
    product.category = category;

    saveProducts();

    res.json({
        message: "Product updated successfully",
        product
    });
});

// 4. DELETE - Delete a product
app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products.splice(index, 1);
    saveProducts();

    res.json({
        message: "Product deleted successfully"
    });
});

// Create HTTP server using Node.js HTTP module
const server = http.createServer(app);

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
