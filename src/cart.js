// ===== CHỈ DÀNH CHO TRANG CART.HTML =====

// Hiển thị danh sách sản phẩm trong giỏ hàng
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (!cartItemsContainer) return;
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Giỏ hàng trống</p>';
        updateCartTotal();
        return;
    }
    
    // Render danh sách sản phẩm
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.image || '../assets/images/default.png'}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description || 'Không có mô tả'}</p>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity('${item.id}')">-</button>
                    <span>${item.quantity || 1}</span>
                    <button onclick="increaseQuantity('${item.id}')">+</button>
                </div>
            </div>
            <div class="item-price">${(item.price || 0).toLocaleString()} VND</div>
            <button onclick="removeItem('${item.id}')">Remove</button>
        </div>
    `).join('');
    
    updateCartTotal();
}

// Tính tổng tiền
function updateCartTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
        totalElement.textContent = `Total: ${total.toLocaleString()} VND`;
    }
}

// Tăng số lượng
function increaseQuantity(itemId) {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cartItems.find(i => i.id === itemId);
    
    if (item) {
        item.quantity = (item.quantity || 1) + 1;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Re-render giỏ hàng
        displayCartItems();
        
        // Gọi hàm của navbar.js để update badge
        if (window.updateCartBadge) {
            window.updateCartBadge();
        }
    }
}

// Giảm số lượng
function decreaseQuantity(itemId) {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cartItems.find(i => i.id === itemId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        displayCartItems();
        
        if (window.updateCartBadge) {
            window.updateCartBadge();
        }
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(itemId) {
    let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems = cartItems.filter(i => i.id !== itemId);
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    displayCartItems();
    
    if (window.updateCartBadge) {
        window.updateCartBadge();
    }
}

// Xử lý thanh toán
function checkout() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cartItems.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    
    // TODO: Thêm logic thanh toán ở đây
    const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    
    if (confirm(`Tổng tiền: ${total.toLocaleString()} VND\nXác nhận thanh toán?`)) {
        // Xử lý thanh toán thành công
        localStorage.removeItem('cart');
        alert('Thanh toán thành công!');
        displayCartItems();
        
        if (window.updateCartBadge) {
            window.updateCartBadge();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy nếu đang ở trang cart
    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }
});

window.addEventListener('storage', function(e) {
    if (e.key === 'cart' && document.querySelector('.cart-items')) {
        displayCartItems();
    }
});
