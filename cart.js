// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = total;
    countEl.style.display = total > 0 ? 'flex' : 'none';
  }
}

function addToCart(product, selectedSize) {
  const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      size: selectedSize,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${product.name} added to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    if (cartTotal) cartTotal.textContent = '$0.00';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.brand} | Size: ${item.size}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-quantity">
        <button onclick="updateQuantity(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${index}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
    </div>
  `).join('');

  if (cartTotal) cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
}

function toggleCart() {
  const cartPanel = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartPanel) {
    cartPanel.classList.toggle('open');
    if (cartOverlay) cartOverlay.classList.toggle('open');
    renderCart();
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Render products from JSON
function renderProducts(products, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image pixel-border">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x400/1a1a1a/fff?text=${encodeURIComponent(product.brand)}'">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-brand">${product.brand}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <div class="product-options">
          <select class="size-select" id="size-${product.id}">
            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
          </select>
          <button class="btn" onclick='addToCart(${JSON.stringify(product)}, document.getElementById("size-${product.id}").value)'>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Fetch products from local JSON
async function fetchLocalProducts(category = null) {
  try {
    const response = await fetch('products.json');
    const data = await response.json();
    if (category) return data[category] || [];
    // Return all products combined
    return [...(data.outerwear || []), ...(data.tees || []), ...(data.jeans || []), ...(data.footwear || []), ...(data.accessories || [])];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
