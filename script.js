// Database of items available in the canteen
const menuItems = [
    { id: 1, name: "Burger", price: 50, image: "burger.jpg" },
    { id: 2, name: "Pancake", price: 30, image: "pancake.webp" },
    { id: 3, name: "Fried Chicken", price: 30, image: "chicken.png" },
    { id: 4, name: "Siomai (4pcs)", price: 20, image: "siomai.jpg" },
    { id: 5, name: "Sisig", price: 70, image: "sisig.jpg" },
    { id: 6, name: "Soft Drinks", price: 25, image: "softdrinks.jpg" },
    { id: 7, name: "Milktea", price: 40, image: "milktea.jpg" }
];

// Load cart from browser storage or start empty if nothing is found
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/** * MENU FUNCTIONS 
 */

// Dynamically creates the HTML for each food item on index.html
function displayMenu() {
    const menuDiv = document.getElementById("menu");
    if (!menuDiv) return;

    menuDiv.innerHTML = "";
    menuItems.forEach(item => {
        menuDiv.innerHTML += `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}" class="menu-img">
                <h3>${item.name}</h3>
                <p class="price">₱${item.price}</p>
                <div class="quantity-wrapper">
                    <input type="number" id="qty-${item.id}" value="0" min="0" class="qty-input">
                    <button onclick="addToCart(${item.id})" class="add-btn">Add</button>
                </div>
            </div>
        `;
    });
}

// Handles adding items to the global cart array and saving to LocalStorage
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const quantityInput = document.getElementById(`qty-${id}`);
    const quantity = parseInt(quantityInput.value) || 0;

    if (quantity <= 0) {
        showAlert("⚠ Please enter a valid quantity.");
        return;
    }

    // Check if item already exists in cart to update quantity instead of adding a new line
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ ...item, quantity: quantity });
    }

    // Sync with browser storage
    localStorage.setItem("cart", JSON.stringify(cart));
    showAlert(`🛒 ${quantity}x ${item.name} added!`);
    quantityInput.value = 0; // Reset input field
}

/** * CART / CHECKOUT FUNCTIONS 
 */

// Refreshes the cart UI and calculates the total price
function updateCart() {
    const cartDiv = document.getElementById("cart");
    const totalSpan = document.getElementById("total");
    if (!cartDiv) return;

    cartDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartDiv.innerHTML += `
            <div class="cart-item">
                <span><strong>${item.name}</strong> (x${item.quantity}) - ₱${itemTotal}</span>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalSpan.textContent = total;
}

// Removes a single item from the cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// Validates and saves the cart as a completed order
function placeOrder() {
    const name = document.getElementById("studentName").value;
    const id = document.getElementById("studentId").value;

    if (!name || !id) {
        showAlert("⚠ Please enter your Name and Student ID.");
        return;
    }
    
    if (cart.length === 0) {
        showAlert("⚠ Your cart is empty!");
        return;
    }

    // Create the order object
    const order = {
        name,
        id,
        items: [...cart], 
        total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0),
        date: new Date().toLocaleString()
    };

    // Save order to the history list in LocalStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear the cart after ordering
    localStorage.removeItem("cart");
    cart = [];

    showAlert("✅ Order Placed! Redirecting...");
    setTimeout(() => {
        window.location.href = "history.html";
    }, 1500); 
}

/** * HISTORY FUNCTIONS 
 */

// Retrieves and displays all saved orders from LocalStorage
function loadOrders() {
    const historyDiv = document.getElementById("orderHistory");
    if (!historyDiv) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    if (orders.length === 0) {
        historyDiv.innerHTML = "<p style='text-align:center; color:gray;'>No orders found.</p>";
        return;
    }

    historyDiv.innerHTML = "";
    
    // Loop through orders and display them (Newest at the bottom)
    orders.forEach((order, index) => {
        historyDiv.innerHTML += `
            <div class="history-item">
                <div class="history-details">
                    <strong>👤 ${order.name}</strong> <small>(${order.id})</small><br>
                    <span style="color: #2D5A27;">🍴 ${order.items.map(i => i.name).join(", ")}</span><br>
                    <strong>💰 Total: ₱${order.total}</strong> | <small>${order.date}</small>
                </div>
                <button class="delete-single-btn" onclick="deleteSpecificOrder(${index})">
                    🗑 Delete
                </button>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee;">
        `;
    });
}

// Deletes a specific order from the history
function deleteSpecificOrder(index) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    if (confirm("Delete this specific order record?")) {
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        loadOrders(); 
        showAlert("🗑 Order deleted.");
    }
}

/** * UTILITY FUNCTIONS 
 */

// Custom alert toast notification
function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 3000);
}

/* Corrected Navigation Logic in script.js */
function goToOrder() {
    if (cart.length === 0) {
        showAlert("⚠ No items in cart!");
        return;
    }
    window.location.href = "order.html";
}
function goToOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        showAlert("⚠ Your cart is empty! Add some food first.");
        return;
    }
    window.location.href = "order.html";
}


function loadOrders() {
    const historyDiv = document.getElementById("orderHistory");
    if (!historyDiv) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    if (orders.length === 0) {
        historyDiv.innerHTML = "<p style='text-align:center; color:gray;'>No orders found.</p>";
        return;
    }

    historyDiv.innerHTML = "";
    
    orders.forEach((order, index) => {
        historyDiv.innerHTML += `
            <div class="history-item">
                <div class="history-details">
                    <strong>👤 ${order.name}</strong> <small>(${order.id})</small><br>
                    <span style="color: #2D5A27;">🍴 ${order.items.map(i => i.name).join(", ")}</span><br>
                    <strong>💰 Total: ₱${order.total}</strong> | <small>${order.date}</small>
                </div>
                <button class="delete-single-btn" onclick="deleteSpecificOrder(${index})">
                    🗑 Delete
                </button>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee;">
        `;
    });
}
