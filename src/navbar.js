// Đọc thông tin người dùng từ localStorage ngay khi load script
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Khi DOM đã sẵn sàng, hiển thị đúng trạng thái đăng nhập
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    updateCartBadge(); // THÊM: Cập nhật badge ngay khi load
});


// ===== SIDEBAR CONTROL =====

const openButton = document.getElementById('open-sidebar-button');
const navbar = document.getElementById('navbar');
const media = window.matchMedia("(width < 700px)");

media.addEventListener('change', (e) => updateNavbar(e));

function updateNavbar(e) {
    const isMobile = e.matches;
    console.log(isMobile);
    if (isMobile) {
        navbar.setAttribute('inert', '');
    } else {
        // desktop device
        navbar.removeAttribute('inert');
    }
}

// SỬA: Gán vào window để file khác có thể gọi
window.openSidebar = function() {
    navbar.classList.add('show');
    openButton.setAttribute('aria-expanded', 'true');
    navbar.removeAttribute('inert');
}

// SỬA: Gán vào window để file khác có thể gọi
window.closeSidebar = function() {
    navbar.classList.remove('show');
    openButton.setAttribute('aria-expanded', 'false');
    navbar.setAttribute('inert', '');
}

updateNavbar(media);


// ===== AUTHENTICATION CODE =====

// Kiểm tra trạng thái đăng nhập khi tải trang
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            currentUser = user;
            showAccountDropdown(user);
        } catch (e) {
            console.error('Error parsing user data:', e);
            showLoginButton();
        }
    } else {
        showLoginButton();
    }
}

// Hiển thị nút Login
function showLoginButton() {
    const loginLi = document.getElementById('loginLi');
    const accountLi = document.getElementById('accountLi');
    const cartLi = document.getElementById('cartLi');
    
    if (loginLi) loginLi.style.display = 'block';
    if (accountLi) accountLi.style.display = 'none';
    if (cartLi) cartLi.style.display = 'none';
}

// Hiển thị dropdown Account
function showAccountDropdown(user) {
    const loginLi = document.getElementById('loginLi');
    const accountLi = document.getElementById('accountLi');
    const cartLi = document.getElementById('cartLi');
    
    if (loginLi) loginLi.style.display = 'none';
    if (accountLi) accountLi.style.display = 'block';
    if (cartLi) cartLi.style.display = 'block';
    
    // Cập nhật thông tin user
    const userName = document.getElementById('userName');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    
    if (userName) userName.textContent = user.name;
    if (dropdownUserName) dropdownUserName.textContent = user.name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;

    // SỬA: Gắn sự kiện cho nút Lịch sử mua hàng TẠI ĐÂY
    // Đây là nơi đáng tin cậy nhất, vì nút này chỉ hiển thị sau khi hàm này chạy
    const historyBtn = document.getElementById('show-history-btn');
    if (historyBtn) {
        // Xóa listener cũ (nếu có) để tránh gắn nhiều lần
        historyBtn.removeEventListener('click', handleShowHistory); 
        // Gắn listener mới
        historyBtn.addEventListener('click', handleShowHistory);
    }
}
// HÀM HIỂN THỊ GIỎ HÀNG (ĐÃ SỬA CHUẨN)
window.showCart = function() {
    const cartContainer = document.querySelector('.cart-container');
    const cartOverlay = document.querySelector('.cart-overlay');

    // Kiểm tra xem user có đăng nhập hay không (Tùy chọn, nếu bạn muốn giới hạn)
    // const currentUser = localStorage.getItem('currentUser');
    // if (!currentUser) { alert('Vui lòng đăng nhập để xem giỏ hàng.'); return; }

    if (cartContainer && cartOverlay) {
        // 1. Bật display để kích hoạt transition
        cartOverlay.style.display = 'block';
        cartContainer.style.display = 'flex'; 

        // 2. Thêm class để kích hoạt hiệu ứng trượt vào (CSS)
        setTimeout(() => {
            cartContainer.classList.add('active');
        }, 10);
        
        // 3. Cập nhật nội dung giỏ hàng
        updateCartDisplay(); 
    }
};
window.updateCartBadge = function() {
    const cartBadge = document.getElementById('cart-badge'); // Dùng ID mới 'cart-badge'
    if (cartBadge) {
        // Lấy số lượng từ localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Cập nhật text
        cartBadge.textContent = totalItems;
        
        // Ẩn/hiện badge
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';

    }
}
// SỬA: Tạo hàm xử lý riêng cho nút Lịch sử
function handleShowHistory(event) {
    event.preventDefault();
            
    // 1. Gọi hàm hiển thị lịch sử (đã được chuyển xuống dưới file này)
    if (typeof window.showPurchaseHistory === 'function') {
        window.showPurchaseHistory();
    }

    // 2. Đóng dropdown
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
        dropdown.classList.remove('show');
    }

    // 3. Đóng sidebar (nếu đang ở mobile)
    if (media.matches && typeof window.closeSidebar === 'function') {
        window.closeSidebar();
    }
}


// Xử lý khi click nút Login
function handleLogin(event) {
    event.preventDefault();
    
    // Đóng sidebar nếu đang ở mobile
    if (media.matches) {
        closeSidebar();
    }
    
    // KIỂM TRA xem đang ở trang nào
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        // Đang ở trong thư mục pages (about, market, cart)
        window.location.href = 'auth.html';
    } else {
        // Đang ở index.html (thư mục gốc)
        window.location.href = 'pages/auth.html';
    }
}

// Xử lý đăng xuất
function handleLogout(event) {
    event.preventDefault();
    
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem('currentUser');
    currentUser = null;
    
    // Đóng dropdown nếu đang mở
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
    
    // Đóng sidebar nếu đang ở mobile
    if (media.matches) {
        closeSidebar();
    }
    
    // Hiển thị lại nút Login
    showLoginButton();
    
    // KIỂM TRA xem đang ở trang nào
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        // Đang ở trong thư mục pages
        window.location.href = '../index.html';
    } else {
        // Đang ở index.html
        window.location.href = 'index.html';
    }
}

// Toggle dropdown menu
function toggleDropdown(event) {
    event.preventDefault();
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Đóng dropdown khi click bên ngoài (chỉ trên desktop)
window.addEventListener('click', function(e) {
    const accountLink = document.querySelector('.account-link');
    const dropdown = document.getElementById('dropdownMenu');
    
    if (!media.matches && accountLink && dropdown) {
        if (!accountLink.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }
});

// Đóng sidebar khi click vào link trong dropdown (mobile)
const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Sửa: Bỏ qua nút "Lịch sử mua hàng" (vì nó là button)
        if (!link.classList.contains('account-link') && !link.classList.contains('logout-link')) {
            if (media.matches) {
                closeSidebar();
            }
        }
    });
});


// ===== CART BADGE - CHẠY Ở TẤT CẢ TRANG =====

// Cập nhật số lượng badge giỏ hàng
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        // Lấy số lượng từ localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Cập nhật text
        cartBadge.textContent = totalItems;
        
        // Thêm/xóa class 'empty'
        if (totalItems === 0) {
            cartBadge.classList.add('empty');
        } else {
            cartBadge.classList.remove('empty');
        }
    }
}

// Lắng nghe thay đổi giỏ hàng từ các tab khác
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        updateCartBadge();
    }
});

// Export để cart.js và các file khác có thể gọi
window.updateCartBadge = updateCartBadge;


// SỬA: CHUYỂN TOÀN BỘ CODE LỊCH SỬ MUA HÀNG VÀO ĐÂY (TỪ MARKETCONTROLLER.JS)

// ===== Purchase history UI =====

// *** THÊM MỚI HÀM NÀY ***
// Hàm helper để định dạng màu mè cho status
function formatOrderStatus(status) {
    let className = 'status-pending';
    if (status === 'Đang giao') className = 'status-shipping';
    if (status === 'Đã giao') className = 'status-delivered';
    if (status === 'Đã hủy') className = 'status-cancelled';
    
    // Chúng ta sẽ dùng thẻ span với class để CSS có thể bắt được
    return `<span class="status-badge ${className}">${status || 'Chờ xử lý'}</span>`;
}

function formatDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch(e){ return iso; }
}

window.showPurchaseHistory = function() {
  const ordersModal = document.getElementById('ordersModal');
  if (!ordersModal) {
      console.error("Modal 'ordersModal' not found in this page.");
      return;
  }
  renderPurchaseHistory();
  ordersModal.style.display = 'flex';
};

window.closePurchaseHistory = function() {
  const ordersModal = document.getElementById('ordersModal');
  if (ordersModal) ordersModal.style.display = 'none';
};

window.showOrderDetails = function(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  
  const titleEl = document.getElementById('orderDetailsTitle');
  if (titleEl) titleEl.textContent = `Chi tiết đơn hàng ${orderId}`;
  
  const container = document.getElementById('orderDetailsContainer');
  if (!container) return;
  
  const booksHtml = (order.items || []).map(item => `
    <div class="book-card-large">
      <div class="book-cover">
<img src="${item.image || '../assets/images/nhom.png'}" alt="${item.name}" onerror="this.src='../assets/images/nhom.png'" />
      </div>
      <div class="book-info">
        <div class="book-name">${item.name}</div>
        <div class="book-qty">Số lượng: <strong>${item.quantity || 1}</strong></div>
        <div class="book-price">Giá: <strong>${item.price}</strong></div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = booksHtml;
  
  const modal = document.getElementById('orderDetailsModal');
  if (modal) modal.style.display = 'flex';
};

window.closeOrderDetails = function() {
  const modal = document.getElementById('orderDetailsModal');
  if (modal) modal.style.display = 'none';
};

function renderPurchaseHistory() {
  const container = document.getElementById('ordersList');
  if (!container) return;
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  if (!orders || orders.length === 0) {
    container.innerHTML = '<div class="empty-orders">Bạn chưa có đơn hàng nào.</div>';
    return;
  }

  container.innerHTML = orders.map(o => {
    const itemCount = (o.items || []).length;
    const totalQty = (o.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0);
    const dateStr = formatDate(o.date);

    const itemsHtml = (o.items || []).map(it => `
      <div class="order-item-thumbnail">
        <img src="${it.image || '../assets/images/nhom.png'}" alt="${it.name}" onerror="this.src='../assets/images/nhom.png'" />
      </div>
    `).join('');
    
    // *** BẮT ĐẦU THAY ĐỔI ***
    return `
      <div class="order-card-centered" onclick="showOrderDetails('${o.id}')" style="cursor:pointer;">
        <div class="order-card-header">
          <div class="order-id">${o.id}</div>
          ${formatOrderStatus(o.status)}
        </div>
        
        <div class="order-thumbnails">
          ${itemsHtml}
        </div>
        
        <div class="order-stats">
          <div class="stat-item">
            <span class="stat-label">Ngày mua</span>
            <span class="stat-value">${dateStr}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-label">Số lượng</span>
            <span class="stat-value">${totalQty} sản phẩm</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-label">Tổng tiền</span>
            <span class="stat-value" style="color:#8b14f9;font-weight:700">${o.total}</span>
          </div>
        </div>
        
        <div class="order-details-link">
          <small>${itemCount} mục trong đơn</small>
        </div>
      </div>
    `;
    // *** KẾT THÚC THAY ĐỔI ***
  }).join('');
}