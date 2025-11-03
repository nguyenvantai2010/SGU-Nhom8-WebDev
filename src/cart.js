// Khởi tạo biến cart ở phạm vi toàn cục
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hàm định dạng giá tiền
function formatPrice(price) {
    // Chuyển đổi chuỗi thành số
    if (typeof price === 'string') {
        // Loại bỏ tất cả ký tự không phải số
        price = parseInt(price.replace(/[^\d]/g, ''), 10);
    }
    // Định dạng số theo tiền tệ VND
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Hàm cập nhật hiển thị giỏ hàng
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartContainer || !totalAmount) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <span>Giỏ hàng của bạn đang trống</span>
            </div>`;
        totalAmount.textContent = formatPrice(0);
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        // Chuyển đổi giá thành số và tính tổng
        const itemPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
        total += itemPrice * item.quantity;

        // Tạo phần tử hiển thị sản phẩm
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='../assets/images/placeholder.png'">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description || 'Không có mô tả'}</p>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-action="decrease" data-index="${index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-action="increase" data-index="${index}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="price">${formatPrice(itemPrice)}</div>
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </div>
        `;
        cartContainer.appendChild(itemElement);
    });

    totalAmount.textContent = formatPrice(total);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Xử lý sự kiện cho các nút trong giỏ hàng
function handleCartAction(e) {
    const button = e.target.closest('button');
    if (!button) return;

    const index = parseInt(button.dataset.index);
    if (isNaN(index)) return;

    const item = cart[index];
    if (!item) return;

    // Lấy số lượng tối đa từ kho
    const marketItems = JSON.parse(localStorage.getItem('marketItems')) || {};
    let maxQuantity = 0;

    for (const category of Object.values(marketItems)) {
        if (category.items) {
            const product = category.items.find(p => p.id === item.id);
            if (product) {
                maxQuantity = product.quantity;
                break;
            }
        }
    }

    if (button.dataset.action === 'increase') {
        if (item.quantity < maxQuantity) {
            item.quantity++;
            updateCartDisplay();
        } else {
            alert(`Chỉ còn ${maxQuantity} sản phẩm trong kho!`);
        }
    } 
    else if (button.dataset.action === 'decrease') {
        if (item.quantity > 1) {
            item.quantity--;
            updateCartDisplay();
        }
    }
    else if (button.classList.contains('remove-btn')) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            cart.splice(index, 1);
            updateCartDisplay();
        }
    }
}

// Hàm xử lý thanh toán
function checkout() {
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    // Cập nhật số lượng trong kho
    const marketItems = JSON.parse(localStorage.getItem('marketItems')) || {};
    let canCheckout = true;

    // Kiểm tra số lượng tồn kho trước khi thanh toán
    cart.forEach(item => {
        let found = false;
        for (const category of Object.values(marketItems)) {
            if (category.items) {
                const product = category.items.find(p => p.id === item.id);
                if (product) {
                    found = true;
                    if (product.quantity < item.quantity) {
                        alert(`Sản phẩm "${item.name}" chỉ còn ${product.quantity} trong kho!`);
                        canCheckout = false;
                    }
                }
            }
        }
        if (!found) {
            alert(`Không tìm thấy sản phẩm "${item.name}" trong kho!`);
            canCheckout = false;
        }
    });

    if (!canCheckout) return;

    // Thực hiện thanh toán
    cart.forEach(item => {
        for (const category of Object.values(marketItems)) {
            if (category.items) {
                const product = category.items.find(p => p.id === item.id);
                if (product) {
                    product.quantity -= item.quantity;
                }
            }
        }
    });

    localStorage.setItem('marketItems', JSON.stringify(marketItems));
    // Clear cart
    cart.length = 0;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    alert('Cảm ơn bạn đã mua hàng!');
}

// Thêm sản phẩm vào giỏ hàng từ trang chi tiết
function addToCart() {
    try {
        // Lấy thông tin sản phẩm từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (!productId) {
            alert('Không tìm thấy thông tin sản phẩm!');
            return;
        }

        // Tìm sản phẩm trong marketItems
        const marketItems = JSON.parse(localStorage.getItem('marketItems')) || {};
        let product = null;

        for (const category of Object.values(marketItems)) {
            if (category.items) {
                product = category.items.find(item => item.id === productId);
                if (product) break;
            }
        }

        if (!product) {
            alert('Không tìm thấy thông tin sản phẩm!');
            return;
        }

        // Lấy số lượng từ input
        const quantityInput = document.getElementById('quantity');
        const quantity = parseInt(quantityInput?.value) || 1;

        // Validate quantity
        if (quantity <= 0) {
            alert('Số lượng phải lớn hơn 0!');
            return;
        }

        // Kiểm tra số lượng tồn kho
        if (quantity > product.quantity) {
            alert(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
            return;
        }

        // Thêm vào giỏ hàng
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex >= 0) {
            const newQuantity = cart[existingItemIndex].quantity + quantity;
            if (newQuantity > product.quantity) {
                alert(`Tổng số lượng trong giỏ hàng không thể vượt quá ${product.quantity}!`);
                return;
            }
            cart[existingItemIndex].quantity = newQuantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                description: product.description
            });
        }

        // Lưu giỏ hàng và chuyển hướng
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm sản phẩm vào giỏ hàng!');
        window.location.href = 'cart.html';
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại!');
    }
}

// Khởi tạo trang
function initializePage() {
    console.log('Initializing cart page...');
    
    // Xử lý sự kiện cho giỏ hàng
    const cartItems = document.querySelector('.cart-items');
    if (cartItems) {
        console.log('Cart items container found');
        cartItems.addEventListener('click', function(event) {
            console.log('Cart click event:', event.target);
            handleCartAction(event);
        });
        updateCartDisplay();
    }

    // Xử lý nút checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        console.log('Checkout button found');
        checkoutBtn.addEventListener('click', function() {
            console.log('Checkout clicked');
            checkout();
        });
    }
}

// Khởi tạo trang khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initializePage);

// Xuất các hàm cần thiết ra global scope
window.addToCart = addToCart;
window.checkout = checkout;
window.handleCartAction = handleCartAction;
window.updateCartDisplay = updateCartDisplay;