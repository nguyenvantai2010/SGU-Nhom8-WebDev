// homeMarket.js - Load RANDOM products for homepage market preview

function formatPriceK(price) {
    if (!price) return '0k';
    const num = parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;
    return `${num}k`;
}

// Hàm lấy random products
function getRandomProducts(allProducts, count = 8) {
    // Tạo bản sao để không ảnh hưởng mảng gốc
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Hàm lưu product ID vào URL parameter và chuyển trang
function openProductInMarket(productName) {
    // Encode tên sản phẩm để an toàn với URL
    const encodedName = encodeURIComponent(productName);
    // Chuyển đến market.html với query parameter
    window.location.href = `pages/market.html?product=${encodedName}`;
}
import { market as defaultMarketItems } from './marketController.js'; 

(function initializeMarketData() {
    const adminProductsString = localStorage.getItem("adminProducts");
    
    if (!adminProductsString) {
        const dataToSave = JSON.stringify(defaultMarketItems);
        localStorage.setItem("adminProducts", dataToSave);
        console.log("Market data initialized in localStorage.");
    }
})();
function loadHomeMarketProducts() {
    // Lấy dữ liệu từ localStorage
    const dataString = localStorage.getItem("adminProducts") || localStorage.getItem("marketItems");
    
    if (!dataString) {
        console.error("No market data found in localStorage");
        return;
    }

    const marketData = JSON.parse(dataString);
    const container = document.getElementById('marketProductsContainer');
    
    if (!container) return;

    // Lấy tất cả products từ các categories
    const allProducts = [];
    Object.values(marketData).forEach(category => {
        if (category.items && Array.isArray(category.items)) {
            category.items.forEach(item => {
                if (item.active !== false) {
                    allProducts.push(item);
                }
            });
        }
    });

    // Lấy 8 sản phẩm RANDOM
    const displayProducts = getRandomProducts(allProducts, 8);

    // Render products
    container.innerHTML = displayProducts.map(product => `
        <div class="market-product-card" data-product-name="${product.name}">
            <div class="product-image-wrapper">
                <img src="${product.image || '../assets/images/placeholder.png'}" 
                     alt="${product.name}"
                     onerror="this.src='../assets/images/placeholder.png'">
            </div>
            <div class="product-info-home">
                <h3 class="product-name-home">${product.name}</h3>
                <div class="product-footer">
                    <p class="product-price-home">${formatPriceK(product.price)}</p>
                    <button class="add-cart-btn-home" onclick="addToCartFromHome(event, '${product.name}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Thêm click event để chuyển đến market page VÀ MỞ POPUP
    document.querySelectorAll('.market-product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Không chuyển trang nếu click vào button
            if (e.target.closest('.add-cart-btn-home')) return;
            
            // Lấy tên sản phẩm và chuyển trang
            const productName = card.getAttribute('data-product-name');
            openProductInMarket(productName);
        });
    });

    // Setup scroll buttons
    setupScrollButtons();
}

// Hàm thêm vào giỏ từ homepage
window.addToCartFromHome = function(event, productName) {
    event.stopPropagation();
    
    // Lấy dữ liệu sản phẩm
    const dataString = localStorage.getItem("adminProducts") || localStorage.getItem("marketItems");
    if (!dataString) return;
    
    const marketData = JSON.parse(dataString);
    let product = null;
    
    // Tìm sản phẩm
    Object.values(marketData).forEach(category => {
        if (category.items) {
            const found = category.items.find(item => item.name === productName);
            if (found) product = found;
        }
    });
    
    if (!product) return;
    
    // Thêm vào cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id || product.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update badge nếu có
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = total;
    }
    
    // Hiển thị thông báo
    alert('Đã thêm vào giỏ hàng!');
};

// Setup scroll buttons - HIỆN KHI CÓ OVERFLOW
function setupScrollButtons() {
    const container = document.getElementById('marketProductsContainer');
    const leftBtn = document.getElementById('scrollLeft');
    const rightBtn = document.getElementById('scrollRight');
    
    if (!container || !leftBtn || !rightBtn) return;
    
    // Hàm kiểm tra và update buttons
    const updateButtons = () => {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (hasOverflow) {
            // Hiện/ẩn nút trái
            if (scrollLeft > 10) {
                leftBtn.style.display = 'block';
            } else {
                leftBtn.style.display = 'none';
            }
            
            // Hiện/ẩn nút phải
            if (scrollLeft < maxScroll - 10) {
                rightBtn.style.display = 'block';
            } else {
                rightBtn.style.display = 'none';
            }
        } else {
            // Không có overflow thì ẩn cả 2 nút
            leftBtn.style.display = 'none';
            rightBtn.style.display = 'none';
        }
    };
    
    // Scroll handlers
    leftBtn.onclick = () => {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };
    
    rightBtn.onclick = () => {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };
    
    // Event listeners
    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    
    // Initial check
    updateButtons();
    
    // Check lại sau khi images load xong
    setTimeout(updateButtons, 500);
}

// Load khi trang ready
document.addEventListener('DOMContentLoaded', loadHomeMarketProducts);