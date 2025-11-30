// Main JavaScript for PinkStationery App

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateWishlistCount();
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Add to wishlist functionality
    const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', toggleWishlist);
        
        // Update wishlist button state
        const productId = button.getAttribute('data-id');
        if (wishlist.some(item => item.id === productId)) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
    
    // Initialize page-specific functionality
    if (window.location.pathname.includes('cart.html')) {
        initializeCartPage();
    } else if (window.location.pathname.includes('wishlist.html')) {
        initializeWishlistPage();
    } else if (window.location.pathname.includes('orders.html')) {
        initializeOrdersPage();
    } else if (window.location.pathname.includes('login.html')) {
        initializeLoginPage();
    }
});

// Add to cart function
function addToCart(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = parseFloat(button.getAttribute('data-price'));
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show confirmation
    showNotification(`${productName} added to cart!`);
}

// Toggle wishlist function
function toggleWishlist(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute('data-id');
    const productName = button.parentElement.parentElement.querySelector('h3').textContent;
    const productPrice = parseFloat(button.parentElement.parentElement.querySelector('.price').textContent.replace('₹', ''));
    
    // Check if product already in wishlist
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex !== -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-heart"></i>';
        showNotification(`${productName} removed from wishlist`);
    } else {
        // Add to wishlist
        wishlist.push({
            id: productId,
            name: productName,
            price: productPrice
        });
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification(`${productName} added to wishlist!`);
    }
    
    // Update localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update wishlist count in header
function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <p>${message}</p>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'var(--accent-pink)';
    notification.style.color = 'white';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'all 0.3s ease';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize cart page
function initializeCartPage() {
    displayCartItems();
    
    // Add event listeners for quantity changes and removals
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('quantity-btn') || event.target.parentElement.classList.contains('quantity-btn')) {
            const button = event.target.classList.contains('quantity-btn') ? event.target : event.target.parentElement;
            const cartItem = button.closest('.cart-item');
            const productId = cartItem.getAttribute('data-id');
            const isIncrease = button.classList.contains('increase');
            
            updateCartItemQuantity(productId, isIncrease);
        }
        
        if (event.target.classList.contains('remove-item') || event.target.parentElement.classList.contains('remove-item')) {
            const button = event.target.classList.contains('remove-item') ? event.target : event.target.parentElement;
            const cartItem = button.closest('.cart-item');
            const productId = cartItem.getAttribute('data-id');
            
            removeCartItem(productId);
        }
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart</p>
                <a href="categories.html" class="browse-products">Browse Products</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.setAttribute('data-id', item.id);
        cartItemElement.innerHTML = `
            <img src="assets/productimages/${getProductImage(item.id)}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">₹${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease"><i class="fas fa-minus"></i></button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn increase"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update cart summary
    const shipping = subtotal > 499 ? 0 : 40;
    const total = subtotal + shipping;
    
    document.querySelector('.subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.querySelector('.shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
    document.querySelector('.total').textContent = `₹${total.toFixed(2)}`;
}

// Get product image based on ID
function getProductImage(productId) {
    const imageMap = {
        '1': 'bag.jpg',
        '2': 'colors.jpg',
        '3': 'notebook.jpg',
        '4': 'pen.jpg'
    };
    
    return imageMap[productId] || 'pen.jpg';
}

// Update cart item quantity
function updateCartItemQuantity(productId, isIncrease) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (isIncrease) {
            item.quantity += 1;
        } else {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // If quantity is 1 and decreasing, remove item
                removeCartItem(productId);
                return;
            }
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update display
        displayCartItems();
        updateCartCount();
    }
}

// Remove cart item
function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update display
    displayCartItems();
    updateCartCount();
    
    showNotification('Item removed from cart');
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    // In a real app, this would redirect to a checkout page
    // For demo, we'll simulate an order
    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        status: 'pending',
        total: calculateCartTotal()
    };
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    displayCartItems();
    updateCartCount();
    
    // Show success message
    showNotification('Order placed successfully!');
    
    // Redirect to orders page after a delay
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 2000);
}

// Calculate cart total
function calculateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 499 ? 0 : 40;
    return subtotal + shipping;
}

// Initialize wishlist page
function initializeWishlistPage() {
    displayWishlistItems();
}

// Display wishlist items
function displayWishlistItems() {
    const wishlistContainer = document.querySelector('.wishlist-items');
    
    if (!wishlistContainer) return;
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add some products to your wishlist</p>
                <a href="categories.html" class="browse-products">Browse Products</a>
            </div>
        `;
        return;
    }
    
    wishlistContainer.innerHTML = '';
    
    wishlist.forEach(item => {
        const wishlistItemElement = document.createElement('div');
        wishlistItemElement.className = 'product-card';
        wishlistItemElement.innerHTML = `
            <img src="assets/productimages/${getProductImage(item.id)}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">₹${item.price}</p>
            <div class="product-actions">
                <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="add-to-wishlist active" data-id="${item.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
        
        wishlistContainer.appendChild(wishlistItemElement);
    });
    
    // Reattach event listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', toggleWishlist);
    });
}

// Initialize orders page
function initializeOrdersPage() {
    displayOrders();
}

// Display orders
function displayOrders() {
    const ordersContainer = document.querySelector('.orders-container');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (!ordersContainer) return;
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box"></i>
                <h3>You have no orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <a href="categories.html" class="browse-products">Browse Products</a>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-card';
        orderElement.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="order-id">${order.id}</span>
                    <span class="order-date">Placed on ${order.date}</span>
                </div>
                <span class="order-status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="assets/productimages/${getProductImage(item.id)}" alt="${item.name}">
                        <span class="order-item-name">${item.name}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span class="order-total">Total: ₹${order.total.toFixed(2)}</span>
                <button class="track-order" data-order-id="${order.id}">
                    <i class="fas fa-map-marker-alt"></i> Track Order
                </button>
            </div>
        `;
        
        ordersContainer.appendChild(orderElement);
    });
    
    // Add event listeners for track order buttons
    const trackOrderButtons = document.querySelectorAll('.track-order');
    trackOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            trackOrder(orderId);
        });
    });
}

// Track order
function trackOrder(orderId) {
    // In a real app, this would show a modal with tracking information
    // For demo, we'll just show a notification
    showNotification(`Tracking information for order ${orderId} would be displayed here`);
}

// Initialize login page
function initializeLoginPage() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (email && password) {
                // In a real app, this would make an API call
                // For demo, we'll just save to localStorage and redirect
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    loggedIn: true
                }));
                
                showNotification('Login successful!');
                
                // Redirect to home page after a delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showNotification('Please fill in all fields');
            }
        });
    }
}