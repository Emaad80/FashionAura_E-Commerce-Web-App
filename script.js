// Cart data
let cart = [];

// Add product to cart
function addToCart(productName, price, imageUrl, size = null) {
  // Load cart from localStorage to ensure it's up-to-date
  loadCart();

  // Check if the product already exists in the cart
  const existingProduct = cart.find(
    (item) => item.name === productName && item.size === size
  );
  if (existingProduct) {
    // If it exists, increase the quantity
    existingProduct.quantity += 1;
  } else {
    // Add new product to the cart
    cart.push({
      name: productName,
      price: Number(price),
      image: imageUrl,
      quantity: 1,
      size: size,
    });
  }

  showNotification(`${productName} added to cart!`);

  // Save updated cart to localStorage
  saveCart();

  // Log for debugging
  console.log("Cart after adding:", cart);
}

// Save cart data to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart data from localStorage
function loadCart() {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    cart = JSON.parse(cartData);
  } else {
    cart = []; // Initialize empty cart if none exists
  }
}
function placeOrder() {
  loadCart(); // Load the latest cart data from localStorage
  if (cart.length === 0) {
    // Check if the cart is empty
    showNotification("Your cart is empty! Please add items before placing an order.");
  } else {
    window.location.href = "order-success.html"; // Proceed if the cart has items
  }
}

// Remove item from cart
function removeFromCart(index) {
  // Remove the item at the specified index
  cart.splice(index, 1);

  // Save updated cart to localStorage
  saveCart();

  // Refresh the display
  displayCart();
}

// Display cart items
function displayCart() {
  // Load cart from localStorage
  loadCart();

  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");
  cartItemsDiv.innerHTML = ""; // Clear previous content

  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    // Display each cart item
    cart.forEach((item, index) => {
      cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-image" />
                    <p>${item.name} ${
        item.size ? `- Size: ${item.size}` : ""
      } - Rs${item.price}</p>
                    <label for="quantity-${index}">Quantity:</label>
                    <input 
                        type="number" 
                        id="quantity-${index}" 
                        value="${item.quantity}" 
                        min="1"
                        onchange="updateQuantity(${index}, this.value)"
                    />
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
      total += item.price * item.quantity; // Calculate total based on quantity
    });
  }

  // Display total
  totalDiv.textContent = `Total: Rs${total.toFixed(2)}`;
}

// Update quantity and recalculate total
function updateQuantity(index, newQuantity) {
  // Ensure the new quantity is valid (>= 1)
  if (newQuantity < 1) {
    showNotification("Quantity cannot be less than 1.");
    displayCart();
    return;
  }

  // Update the quantity in the cart
  cart[index].quantity = Number(newQuantity);

  // Save updated cart to localStorage
  saveCart();

  // Refresh the display to reflect changes
  displayCart();
}
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
// Clear cart
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  displayCart();
  showNotification("All items have been removed from the cart.");
}

// Initialize cart display if on the cart page
if (window.location.pathname.endsWith("cart.html")) {
  displayCart();
}