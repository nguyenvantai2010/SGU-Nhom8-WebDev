// Đọc thông tin người dùng từ localStorage ngay khi load script
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Khi DOM đã sẵn sàng, hiển thị đúng trạng thái đăng nhập
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    updateCartBadge(); // THÊM: Cập nhật badge ngay khi load
    setupProfileModalListeners(); // Cài đặt modal "Cài đặt tài khoản"
    setupPasswordModalListeners(); // Cài đặt modal "Đổi mật khẩu"

    // Listener chung cho Overlay để đóng tất cả các modal
    const overlay = document.getElementById('profile-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                const pModal = document.getElementById('profile-modal');
                const passModal = document.getElementById('password-modal');
                if (pModal) pModal.style.display = 'none';
                if (passModal) passModal.style.display = 'none';
            }
        });
    }
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

function openSidebar() {
    navbar.classList.add('show');
    openButton.setAttribute('aria-expanded', 'true');
    navbar.removeAttribute('inert');
}

function closeSidebar() {
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
    
    // Ưu tiên "name" (Tên đầy đủ) nếu có, nếu không thì dùng "username"
    const displayName = user.name || user.username;
    
    if (userName) userName.textContent = displayName;
    if (dropdownUserName) dropdownUserName.textContent = displayName;
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;
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
        // Không đóng sidebar khi click vào "Cài đặt", "Đổi mật khẩu" hoặc "Logout"
        if (!link.classList.contains('account-link') && 
            !link.classList.contains('logout-link') && 
            !link.href.includes('#settings') &&
            !link.href.includes('#change-password')
            ) {
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


// ===== PROFILE SETTINGS MODAL =====

function setupProfileModalListeners() {
    const settingsLink = document.querySelector('a[href="#settings"]');
    const profileModal = document.getElementById('profile-modal');
    const profileOverlay = document.getElementById('profile-overlay');
    const closeBtn = document.getElementById('close-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const messageEl = document.getElementById('profile-message'); // (MỚI) Thêm dòng này

    if (!settingsLink || !profileModal || !profileOverlay || !closeBtn || !profileForm || !messageEl) { // (MỚI) Thêm messageEl
        console.warn("Một số thành phần của Profile Modal không tìm thấy.");
        return;
    }

    // Mở Modal
    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) return; // Không mở nếu chưa đăng nhập

        // Đóng dropdown trước khi mở modal
        const dropdown = document.getElementById('dropdownMenu');
        if (dropdown) dropdown.classList.remove('show');

        // Tải dữ liệu hiện tại vào form
        document.getElementById('profile-name').value = currentUser.name || '';
        document.getElementById('profile-email').value = currentUser.email || ''; // (MỚI) Thêm dòng này
        document.getElementById('profile-address').value = currentUser.address || '';
        document.getElementById('profile-phone').value = currentUser.phone || '';
        messageEl.textContent = ''; // (MỚI) Xóa thông báo cũ

        // Hiển thị modal
        profileOverlay.style.display = 'block';
        profileModal.style.display = 'block';
    });

    // Đóng Modal (Nút X)
    const closeProfileModal = () => {
        profileOverlay.style.display = 'none';
        profileModal.style.display = 'none';
        messageEl.textContent = ''; // (MỚI) Xóa thông báo khi đóng
    };

    closeBtn.addEventListener('click', closeProfileModal);

    // Lưu thông tin
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        messageEl.textContent = '';
        messageEl.style.color = 'red';
        
        // 1. Lấy dữ liệu từ form
        const newName = document.getElementById('profile-name').value;
        const newEmail = document.getElementById('profile-email').value; // (MỚI) Thêm dòng này
        const newAddress = document.getElementById('profile-address').value;
        const newPhone = document.getElementById('profile-phone').value;

        // (MỚI) 2. Kiểm tra Email trùng lặp
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = users.find(u => u.email === newEmail && u.username !== currentUser.username);

        if (emailExists) {
            messageEl.textContent = 'Email này đã được sử dụng bởi tài khoản khác.';
            return;
        }

        // 3. Cập nhật đối tượng 'currentUser' (biến toàn cục)
        currentUser.name = newName;
        currentUser.email = newEmail; // (MỚI) Thêm dòng này
        currentUser.address = newAddress;
        currentUser.phone = newPhone;

        // 4. Cập nhật 'currentUser' trong localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // 5. CẬP NHẬT danh sách 'users' (quan trọng cho admin và lần đăng nhập sau)
        try {
            // (Đã dời `let users` lên trên để check email)
            const userIndex = users.findIndex(u => u.username === currentUser.username);
            
            if (userIndex > -1) {
                // Cập nhật thông tin của user này trong danh sách
                users[userIndex].name = newName;
                users[userIndex].email = newEmail; // (MỚI) Thêm dòng này
                users[userIndex].address = newAddress;
                users[userIndex].phone = newPhone;
                // Lưu lại danh sách 'users'
                localStorage.setItem('users', JSON.stringify(users));
            }
        } catch (err) {
            console.error("Không thể cập nhật danh sách 'users':", err);
        }

        // 6. Cập nhật giao diện (tên trên navbar)
        const displayName = currentUser.name || currentUser.username;
        document.getElementById('userName').textContent = displayName;
        document.getElementById('dropdownUserName').textContent = displayName;
        document.getElementById('dropdownUserEmail').textContent = newEmail; // (MỚI) Thêm dòng này

        // 7. Đóng modal (sau khi báo thành công)
        messageEl.style.color = 'green';
        messageEl.textContent = 'Cập nhật thông tin thành công!';
        
        setTimeout(closeProfileModal, 1500);
    });
}

// ===== CHANGE PASSWORD MODAL =====
function setupPasswordModalListeners() {
    const changePasswordLink = document.querySelector('a[href="#change-password"]');
    const passwordModal = document.getElementById('password-modal');
    const profileOverlay = document.getElementById('profile-overlay'); // Re-use the same overlay
    const closeBtn = document.getElementById('close-password-btn');
    const passwordForm = document.getElementById('password-form');
    const messageEl = document.getElementById('password-message');

    if (!changePasswordLink || !passwordModal || !profileOverlay || !closeBtn || !passwordForm || !messageEl) {
        console.warn("Một số thành phần của Password Modal không tìm thấy.");
        return;
    }

    // Mở Modal
    changePasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const dropdown = document.getElementById('dropdownMenu');
        if (dropdown) dropdown.classList.remove('show');

        messageEl.textContent = ''; // Xóa thông báo cũ
        passwordForm.reset(); // Xóa input cũ
        profileOverlay.style.display = 'block';
        passwordModal.style.display = 'block';
    });

    // Đóng Modal
    const closePasswordModal = () => {
        profileOverlay.style.display = 'none';
        passwordModal.style.display = 'none';
        messageEl.textContent = '';
        passwordForm.reset();
    };

    closeBtn.addEventListener('click', closePasswordModal);

    // Lưu Mật Khẩu Mới
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        messageEl.textContent = '';
        messageEl.style.color = 'red';

        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        // 1. Check mật khẩu cũ
        if (oldPassword !== currentUser.password) {
            messageEl.textContent = 'Mật khẩu cũ không đúng.';
            return;
        }
        
        // 2. Check mật khẩu mới (dài > 6)
        if (newPassword.length < 6) {
            messageEl.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
            return;
        }

        // 3. Check mật khẩu mới khớp
        if (newPassword !== confirmNewPassword) {
            messageEl.textContent = 'Mật khẩu mới không khớp.';
            return;
        }

        // Tất cả đều ổn -> Lưu
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        try {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.username === currentUser.username);
            if (userIndex > -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
            }
        } catch (err) {
            console.error("Không thể cập nhật mật khẩu trong 'users' list:", err);
        }

        messageEl.style.color = 'green';
        messageEl.textContent = 'Đổi mật khẩu thành công!';
        
        setTimeout(closePasswordModal, 1500);
    });
}