import {
    marketItems as defaultMarketItems
} from './marketController.js';

// Đổi tab market và accounts

function setActiveTab(tab) {
    document.querySelectorAll(".admin-category-bar li").forEach(li => li.classList.remove("active"));
    document.getElementById(`${tab}-tab`).classList.add("active");

    const marketPanel = document.getElementById("market");
    const accountsPanel = document.getElementById("accounts");

    if (tab === "market") {
        marketPanel.style.display = "block";
        accountsPanel.style.display = "none";
    } else {
        marketPanel.style.display = "none";
        accountsPanel.style.display = "block";
    }
}

//xử lý sự kiện khi chuyển tab
document.getElementById("market-tab").addEventListener("click", () => setActiveTab("market"));
document.getElementById("accounts-tab").addEventListener("click", () => setActiveTab("accounts"));

// load sản phẩm đã lưu nếu không có thì load mặc định
function loadProductsFromStorage() {
    const dataString = localStorage.getItem("adminProducts");
    if (dataString) {
        return JSON.parse(dataString);// chuyển từ string sang object
    }
    return JSON.parse(JSON.stringify(defaultMarketItems));
}

//hàm lưu sản phẩm
function saveProductsToStorage() {
    const dataString = JSON.stringify(marketItems);// chuyển từ object sang string
    localStorage.setItem("adminProducts", dataString);
}

let marketItems = loadProductsFromStorage();


let currentCategory = Object.keys(marketItems)[0]; // chọn danh mục hiện tại là mặc định
let currentProductEditIndex = null; 
const categorySelect = document.getElementById("category-select");

//hàm render bảng dang mục
function renderCategorySelector() {
    // Thêm kiểm tra null phòng trường hợp không tìm thấy thẻ
    if (!categorySelect) return; 
    categorySelect.innerHTML = ""; // Xóa các option cũ
    Object.keys(marketItems).forEach(categoryName => {
        const option = document.createElement("option");
        option.value = categoryName;
        option.textContent = categoryName;
        if (categoryName === currentCategory) {
            option.selected = true; // Chọn đúng mục đang active
        }
        categorySelect.appendChild(option);
    });
}

// xử lý sự kiện làm xuất hiện các danh mục
if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
        currentCategory = e.target.value; 
        renderProductTable(); 
    });
}

const modal = document.getElementById("addform");
const addProductForm = document.getElementById("add-pr-frm");
const addProductBtn = document.querySelector(".add-product-bt");
const closePrModalBtn = document.getElementById("close-pr-frm-btn");

// Mở form thêm sản phẩm
function openModal() {
    addProductForm.reset();
    currentProductEditIndex = null; 
    modal.classList.add("visible");
    modal.querySelector("h2").textContent = "Add New Product";
    modal.querySelector("button[type='submit']").textContent = "Add Product";
}

// Mở form sửa sản phẩm
function openEditModal(index) {
   const item = marketItems[currentCategory][index]; 

    document.getElementById("product-name").value = item.name;
    document.getElementById("product-price").value = item.price.replace('$', '');
    document.getElementById("product-image").value = item.image;

    currentProductEditIndex = index; 
    modal.classList.add("visible");
    modal.querySelector("h2").textContent = "Edit Product";
    modal.querySelector("button[type='submit']").textContent = "Save Changes";
}
// =========================================

// Đóng form
function closeModal() {
    modal.classList.remove("visible");
}

// Xử lý sự kiện đóng/mở form sản phẩm
addProductBtn.addEventListener("click", openModal);
closePrModalBtn.addEventListener("click", closeModal);

//đóng form khi click vào nền ( thẻ div có class là addform)
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// Xử lý sự kiện khi nộp form sản phẩm
addProductForm.addEventListener("submit", (e) => {

    const name = document.getElementById("product-name").value;
    const priceValue = parseFloat(document.getElementById("product-price").value) || 0;
    const price = "$" + priceValue;
    const image = document.getElementById("product-image").value;
    const newItem = { name, price, image };

    if (currentProductEditIndex !== null) {// nếu đang sửa thì thay đổi thông tin sản phẩm
        marketItems[currentCategory][currentProductEditIndex] = newItem; 
    } else {
        marketItems[currentCategory].push(newItem);// nếu đang thêm thì thêm sản phẩm mới vào
    }

    renderProductTable();
    closeModal();
    currentProductEditIndex = null; 
    saveProductsToStorage();
});

// Render bảng sản phẩm
function renderProductTable() {
    const tbody = document.querySelector(".product-table tbody");
    tbody.innerHTML = "";

    let id = 1;
    const itemsToRender = marketItems[currentCategory] || []; 

    itemsToRender.forEach((item, index) => { // Sửa ở đây
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${id++}</td>
            <td>${item.name}</td>
            <td>${item.price}</td> 
            <td><img src="${item.image}" alt="Product" class="item-image"></td>
            <td>
                <button class="edit-btn" title="Edit" data-index="${index}"> 
                    <svg width="18px" height="18px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 0L16 3L9 10H6V7L13 0Z" fill="#000000"></path>
                        <path d="M1 1V15H15V9H13V13H3V3H7V1H1Z" fill="#000000"></path>
                    </svg>
                </button>
                <button class="delete-btn" title="Delete" data-index="${index}">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M14 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M6 7H18V18C18 19.66 16.66 21 15 21H9C7.34 21 6 19.66 6 18V7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


//load tài khoản đã lưu
function loadAccountsFromStorage() {
    const dataString = localStorage.getItem("adminAccounts");
    if (dataString) {
        return JSON.parse(dataString);
    }
    return {
        "Tai khoan": [
            { username: "admin", password: "secret123" }
        ]
    };
}

//lưu tài khoản
function saveAccountsToStorage() {
    const dataString = JSON.stringify(accountsList);
    localStorage.setItem("adminAccounts", dataString);
}

//khởi tạo danh sách ban đầu
let accountsList = loadAccountsFromStorage();
let currentAccountEditIndex = null; 

const accModal = document.getElementById("addAccountForm");
const addAccountForm = document.getElementById("add-acc-frm");
const addAccountBtn = document.querySelector(".add-accounts-bt");
const closeAccModalBtn = document.getElementById("close-acc-frm-btn");

// mở form tài khoản
function openAccountModal() {
    addAccountForm.reset();
    currentAccountEditIndex = null;  
    accModal.classList.add("visible");
    accModal.querySelector("h2").textContent = "Add New Account";
    accModal.querySelector("button[type='submit']").textContent = "Add Account";
}

// mở form edit tài khoảng
function openAccountEditModal(index) {
    const item = accountsList["Tai khoan"][index];
    document.getElementById("account-username").value = item.username;
    document.getElementById("account-password").value = item.password;

    currentAccountEditIndex = index; 
    accModal.classList.add("visible");
    accModal.querySelector("h2").textContent = "Edit Account";
    accModal.querySelector("button[type='submit']").textContent = "Save Changes";
}

//đóng form edit tài khoản
function closeAccountModal() {
    accModal.classList.remove("visible");
}

//xử lý sự kiện cho đóng/mở form
addAccountBtn.addEventListener("click", openAccountModal);
closeAccModalBtn.addEventListener("click", closeAccountModal);

//xử lý sự kiện khi click vào nền thì đóng form ( thẻ div có class addaccountform)
accModal.addEventListener("click", (e) => {
    if (e.target === accModal) {
        closeAccountModal();
    }
});

// xử lý sự kiện submit tài khoản
addAccountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("account-username").value;
    const password = document.getElementById("account-password").value;

    if (username && password) {
        const newAccount = { username, password };

        if (currentAccountEditIndex !== null) { // nếu đang sửa thì sửa
            accountsList["Tai khoan"][currentAccountEditIndex] = newAccount; 
        } else { // nếu đang thêm thì thêm
            accountsList["Tai khoan"].push(newAccount);
        }

        renderAccountsTable();
        closeAccountModal();
        saveAccountsToStorage();
        currentAccountEditIndex = null; 
    } else {
        alert("Please enter your username and password.");
    }
});

function renderAccountsTable() {
    const tbody = document.querySelector(".accounts-table tbody");
    tbody.innerHTML = "";

    let id = 1;
    accountsList["Tai khoan"].forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${id++}</td>
            <td>${item.username}</td>
            <td>${item.password}</td>
            <td>
                <button class="edit-btn" title="Edit" data-index="${index}"> 
                    <svg width="18px" height="18px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 0L16 3L9 10H6V7L13 0Z" fill="#000000"></path>
                        <path d="M1 1V15H15V9H13V13H3V3H7V1H1Z" fill="#000000"></path>
                    </svg>
                </button>
                <button class="delete-btn" title="Delete" data-index="${index}">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
G                      <path d="M14 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M6 7H18V18C18 19.66 16.66 21 15 21H9C7.34 21 6 19.66 6 18V7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

}


// xử lý sự kiện nút xóa và sửa cho form sản phẩm
document.querySelector(".product-table tbody").addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
        const index = editBtn.dataset.index;
        openEditModal(index);
        return;
    }

    // Tìm nút delete gần nhất mà người dùng click
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
        if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            const index = deleteBtn.dataset.index;
            // Sửa ở đây: Dùng currentCategory
            marketItems[currentCategory].splice(index, 1);
            renderProductTable();
            saveProductsToStorage();
        }
    }
});

// xử lý sự kiện nút xóa và sửa cho form tài khoản
document.querySelector(".accounts-table tbody").addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
        const index = editBtn.dataset.index;
        openAccountEditModal(index);
        return;
    }

    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
        const index = deleteBtn.dataset.index;
        const account = accountsList["Tai khoan"][index];

        // không được xóa tài khoản admin
        if (account.username === "admin") {
            alert("Bạn không thể xóa tài khoản 'admin' mặc định!");
            return;
        }

        if (confirm(`Bạn có chắc muốn xóa tài khoản '${account.username}'?`)) {
            accountsList["Tai khoan"].splice(index, 1);
            renderAccountsTable();
            saveAccountsToStorage();
        }
    }
});

//render mac dinh khi load trang
renderCategorySelector();
renderProductTable();
renderAccountsTable();
setActiveTab("market");