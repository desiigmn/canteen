const menuItems = [
    { id: 1, name: "Burger", price: 50, image: "burger.jpg" },
    { id: 2, name: "Pancake", price: 30, image: "pancake.webp" },
    { id: 3, name: "Fried Chicken", price: 30, image: "chicken.png" },
    { id: 4, name: "Siomai (4pcs)", price: 20, image: "siomai.jpg" },
    { id: 5, name: "Sisig", price: 70, image: "sisig.jpg" },
    { id: 6, name: "Soft Drinks", price: 25, image: "softdrinks.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* MENU DISPLAY */
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
function updateCart() {
    const cartDiv = document.getElementById("cart");
    const totalSpan = document.getElementById("total");
    if (!cartDiv) return;

    cartDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        // Validation: ensure price and quantity are treated as numbers
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        const itemTotal = price * qty;
        
        total += itemTotal;
        
        cartDiv.innerHTML += `
            <div class="cart-item">
                <span><strong>${item.name || 'Unknown Item'}</strong> (x${qty}) - ₱${itemTotal}</span>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    // Ensure the total displayed is always a valid number
    totalSpan.textContent = isNaN(total) ? 0 : total;
}

/* CART LOGIC */
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

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

/* ORDERING & REDIRECTION */
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

    const order = {
        name,
        id,
        items: [...cart], // Copy current cart
        total: cart.reduce((sum, i) => sum + i.price, 0),
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");
    cart = [];

    showAlert("✅ Order Placed! Redirecting...");

    setTimeout(() => {
        window.location.href = "history.html";
    }, 1500); 
}

/* HISTORY LOGIC */
function loadOrders() {
    const historyDiv = document.getElementById("orderHistory");
    if (!historyDiv) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    historyDiv.innerHTML = orders.length === 0 ? "<p>No orders found.</p>" : "";

    orders.reverse().forEach(order => { // Show newest orders first
        historyDiv.innerHTML += `
            <div class="history-card">
                <strong>👤 ${order.name}</strong> <small>(${order.id})</small><br>
                <p>🍴 ${order.items.map(i => i.name).join(", ")}</p>
                <div style="display:flex; justify-content:space-between;">
                    <span>💰 Total: ₱${order.total}</span>
                    <span style="color: gray;">📅 ${order.date}</span>
                </div>
            </div>
            <hr>
        `;
    });
}

/* UTILS */
function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 3000);
}

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
/* HISTORY LOGIC - WITH INDIVIDUAL DELETE */
function loadOrders() {
    const historyDiv = document.getElementById("orderHistory");
    if (!historyDiv) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    if (orders.length === 0) {
        historyDiv.innerHTML = "<p style='text-align:center; color:gray;'>No orders found.</p>";
        return;
    }

    historyDiv.innerHTML = "";
    // Note: We use index to identify which one to delete
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

function deleteSpecificOrder(index) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    if (confirm("Delete this specific order record?")) {
        orders.splice(index, 1); // Remove only the item at this index
        localStorage.setItem("orders", JSON.stringify(orders));
        loadOrders(); // Refresh the list
        showAlert("🗑 Order deleted.");
    }
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const quantityInput = document.getElementById(`qty-${id}`);
    const quantity = parseInt(quantityInput.value) || 1;

    if (quantity <= 0) {
        showAlert("⚠ Please enter a valid quantity.");
        return;
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ ...item, quantity: quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showAlert(`🛒 ${quantity}x ${item.name} added!`);
    
    // Reset input to 1 after adding
    quantityInput.value = 1;
}