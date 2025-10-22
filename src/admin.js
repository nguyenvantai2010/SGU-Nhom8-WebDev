import {
    marketItems as defaultMarketItems
} from './marketController.js';

// Đổi tab market và accounts
document.getElementById("market-tab").addEventListener("click", () => setActiveTab("market"));
document.getElementById("accounts-tab").addEventListener("click", () => setActiveTab("accounts"));
import{
    marketItems
} from './marketController.js'
document.getElementById("market-tab").addEventListener("click", () => setActiveTab("market"));
document.getElementById("accounts-tab").addEventListener("click", () => setActiveTab("accounts"));

function setActiveTab(tab) {
    document.querySelectorAll(".admin-category-bar li").forEach(li => li.classList.remove("active"));
    document.getElementById(`${tab}-tab`).classList.add("active");

    const marketPanel = document.getElementById("market");
    const accountsPanel = document.getElementById("accounts");

    if(tab === "market") {
        marketPanel.style.display = "block";
        accountsPanel.style.display = "none";
    } else {
        marketPanel.style.display = "none";
        accountsPanel.style.display = "block";
    }
}

setActiveTab("market");


function loadProductsFromStorage() {
    const dataString = localStorage.getItem("adminProducts");
    if (dataString) { 
        return JSON.parse(dataString); 
    }
    return marketItems;
}

function saveProductsToStorage() {
    const dataString = JSON.stringify(marketItems);
    localStorage.setItem("adminProducts", dataString);
}

let marketItems = loadProductsFromStorage();
let currentEditIndex = null; 


const modal = document.getElementById("addform"); 
const addProductForm = document.getElementById("add-pr-frm"); // lay id cua form them 
const addProductBtn = document.querySelector(".add-product-bt");
const closePrModalBtn = document.getElementById("close-pr-frm-btn"); // Đã sửa

//hien thi form them san pham
function openModal() {
    addProductForm.reset();
    currentEditIndex = null;
    modal.classList.add("visible");
    modal.querySelector("h2").textContent = "Add New Product";
    modal.querySelector("button[type='submit']").textContent = "Add Product";
}

//hien thi form sua san pham
function openEditModal(index) {
    const item = marketItems["Default"][index];
    document.getElementById("product-name").value = item.name;
    document.getElementById("product-price").value = item.price.replace('$', '');
    document.getElementById("product-image").value = item.image;
    
    currentEditIndex = index;
    modal.classList.add("visible");
    modal.querySelector("h2").textContent = "Edit Product";
    modal.querySelector("button[type='submit']").textContent = "Save Changes";
}

//dong form
function closeModal() {
    modal.classList.remove("visible");
}

//xu ly su kien dong mo form them san pham
addProductBtn.addEventListener("click", openModal);
closePrModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

//form them san pham
addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("product-name").value;
    const priceValue = parseFloat(document.getElementById("product-price").value) || 0;
    const price = "$" + priceValue;
    const image = document.getElementById("product-image").value;
    const newItem = { name, price, image };

    if (currentEditIndex !== null) {
        
        marketItems["Default"][currentEditIndex] = newItem;
    } else {
        
        marketItems["Default"].push(newItem);
    }

    renderProductTable(); 
    closeModal();
    currentEditIndex = null; 
    saveProductsToStorage();
});

// tao bang san pham
function renderProductTable() {
    const tbody = document.querySelector(".product-table tbody");
    tbody.innerHTML = "";

    let id = 1;
    marketItems["Default"].forEach((item, index) => {
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


    document.querySelectorAll(".product-table .delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index; 
            marketItems["Default"].splice(index, 1);
            renderProductTable(); 
            saveProductsToStorage();
        });
    });

    document.querySelectorAll(".product-table .edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index; 
            openEditModal(index); 
        });
    });
}

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

// load sản phẩm đã lưu nếu không có thì load mặc định

function loadProductsFromStorage() {
    const dataString = localStorage.getItem("adminProducts");
    if (dataString) {
        return JSON.parse(dataString);
    }
   
    return JSON.parse(JSON.stringify(defaultMarketItems));
}

function saveProductsToStorage() {
    const dataString = JSON.stringify(marketItems);
    localStorage.setItem("adminProducts", dataString);
}

let marketItems = loadProductsFromStorage();
let currentProductEditIndex = null; 

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
    const item = marketItems["Default"][index];
    document.getElementById("product-name").value = item.name;
    document.getElementById("product-price").value = item.price.replace('$', '');
    document.getElementById("product-image").value = item.image;

    currentProductEditIndex = index;  
    modal.classList.add("visible");
    modal.querySelector("h2").textContent = "Edit Product";
    modal.querySelector("button[type='submit']").textContent = "Save Changes";
}

// Đóng form
function closeModal() {
    modal.classList.remove("visible");
}

// Xử lý sự kiện đóng/mở form sản phẩm
addProductBtn.addEventListener("click", openModal);
closePrModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// Xử lý nộp form sản phẩm
addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("product-name").value;
    const priceValue = parseFloat(document.getElementById("product-price").value) || 0;
    const price = "$" + priceValue;
    const image = document.getElementById("product-image").value;
    const newItem = { name, price, image };

    if (currentProductEditIndex !== null) {
        marketItems["Default"][currentProductEditIndex] = newItem; 
    } else {
        marketItems["Default"].push(newItem);
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
    marketItems["Default"].forEach((item, index) => {
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

// === PHẦN QUẢN LÝ TÀI KHOẢN (ACCOUNTS) ===

function loadAccountsFromStorage() {
    const dataString = localStorage.getItem("adminAccounts");
    if (dataString) {
        return JSON.parse(dataString);
    }
    return {
        "Default": [
            { username: "admin", password: "secret123" }
        ]
    };
}

function saveAccountsToStorage() {
    const dataString = JSON.stringify(accountsList);
    localStorage.setItem("adminAccounts", dataString);
}

let accountsList = loadAccountsFromStorage();
// SỬA LỖI 1: Dùng biến riêng cho tài khoản
let currentAccountEditIndex = null; 

const accModal = document.getElementById("addAccountForm");
const addAccountForm = document.getElementById("add-acc-frm");
const addAccountBtn = document.querySelector(".add-accounts-bt");
const closeAccModalBtn = document.getElementById("close-acc-frm-btn");

// Mở form thêm tài khoản
function openAccountModal() {
    addAccountForm.reset();
    currentAccountEditIndex = null;  
    accModal.classList.add("visible");
    accModal.querySelector("h2").textContent = "Add New Account";
    accModal.querySelector("button[type='submit']").textContent = "Add Account";
}

// Mở form sửa tài khoản
function openAccountEditModal(index) {
    const item = accountsList["Default"][index];
    document.getElementById("account-username").value = item.username;
    document.getElementById("account-password").value = item.password;

    currentAccountEditIndex = index;  
    accModal.classList.add("visible");
    accModal.querySelector("h2").textContent = "Edit Account";
    accModal.querySelector("button[type='submit']").textContent = "Save Changes";
}

// Đóng form tài khoản
function closeAccountModal() {
    accModal.classList.remove("visible");
}

// Xử lý sự kiện đóng/mở form tài khoản
addAccountBtn.addEventListener("click", openAccountModal);
closeAccModalBtn.addEventListener("click", closeAccountModal);
accModal.addEventListener("click", (e) => {
    if (e.target === accModal) {
        closeAccountModal();
    }
});

// Xử lý nộp form tài khoản
addAccountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("account-username").value;
    const password = document.getElementById("account-password").value;

    if (username && password) {
        const newAccount = { username, password };

        if (currentAccountEditIndex !== null) {  
            accountsList["Default"][currentAccountEditIndex] = newAccount;  
        } else {
            accountsList["Default"].push(newAccount);
        }

        renderAccountsTable();
        closeAccountModal();
        saveAccountsToStorage();
        currentAccountEditIndex = null;  
    } else {
        alert("Please enter your username and password.");
    }
});

// Render bảng tài khoản
function renderAccountsTable() {
    const tbody = document.querySelector(".accounts-table tbody");
    tbody.innerHTML = "";

    let id = 1;
    accountsList["Default"].forEach((item, index) => {
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

// === KHỞI TẠO BAN ĐẦU VÀ GÁN SỰ KIỆN ===

// Render các bảng lần đầu khi tải trang
renderProductTable();
renderAccountsTable();

// Đặt tab mặc định
setActiveTab("market");

// Gán 1 lần duy nhất cho TẤT CẢ các nút Edit/Delete trong bảng sản phẩm
document.querySelector(".product-table tbody").addEventListener("click", (e) => {
    // Tìm nút edit gần nhất mà người dùng click
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
            marketItems["Default"].splice(index, 1);
            renderProductTable();
            saveProductsToStorage();
        }
    }
});

// Gán 1 lần duy nhất cho TẤT CẢ các nút Edit/Delete trong bảng tài khoản
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
        const account = accountsList["Default"][index];

        // Thêm bảo vệ, không cho xóa tài khoản admin
        if (account.username === "admin") {
            alert("Bạn không thể xóa tài khoản 'admin' mặc định!");
            return;
        }

        if (confirm(`Bạn có chắc muốn xóa tài khoản '${account.username}'?`)) {
            accountsList["Default"].splice(index, 1);
            renderAccountsTable();
            saveAccountsToStorage();
        }
    }
});
//load tai khoan da luu 
function loadAccountsFromStorage() {
    const dataString = localStorage.getItem("adminAccounts");
    if(dataString){ 
        return JSON.parse(dataString);
    }
    return {
        "Default":[
            { username: "admin", password:"secret123" }
        ]
    };
}
//luu tai khoan
function saveAccountsToStorage(){
    const dataString = JSON.stringify(accountsList);
    localStorage.setItem("adminAccounts",dataString);
}

let accountsList = loadAccountsFromStorage();

const accModal = document.getElementById("addAccountForm");
const addAccountForm = document.getElementById("add-acc-frm");
const addAccountBtn = document.querySelector(".add-accounts-bt");
const closeAccModalBtn = document.getElementById("close-acc-frm-btn");

//hien thi form them tai khoan
function openAccountModal() {
    addAccountForm.reset();
    currentEditIndex = null; 
    accModal.classList.add("visible");
    
    accModal.querySelector("h2").textContent = "Add New Account";
    accModal.querySelector("button[type='submit']").textContent = "Add Account";
}

//hien thi form chinh sua tai khoan
function openAccountEditModal(index) {
    const item = accountsList["Default"][index];

    document.getElementById("account-username").value = item.username;
    document.getElementById("account-password").value = item.password;

    currentEditIndex = index;

    accModal.classList.add("visible");
    accModal.querySelector("h2").textContent = "Edit Account";
    accModal.querySelector("button[type='submit']").textContent = "Save Changes";
}

//dong form them tai khoan
function closeAccountModal() {
    accModal.classList.remove("visible");
}


addAccountBtn.addEventListener("click", openAccountModal);
closeAccModalBtn.addEventListener("click", closeAccountModal);


accModal.addEventListener("click", (e) => {
    if (e.target === accModal) {
        closeAccountModal();
    }
});


addAccountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const username = document.getElementById("account-username").value;
    const password = document.getElementById("account-password").value;
    
    if (username && password) {
        const newAccount = { username, password };

      
        if (currentEditIndex !== null) {

            accountsList["Default"][currentEditIndex] = newAccount;
        } else {

            accountsList["Default"].push(newAccount);
        }
        
        renderAccountsTable();
        closeAccountModal();
        saveAccountsToStorage();
        currentEditIndex = null; 

    } else {
        alert("Please enter your username and password.");
    }
});

//render bang tai khoan
function renderAccountsTable() {
    const tbody = document.querySelector(".accounts-table tbody");
    tbody.innerHTML = "";

    let id = 1;
    accountsList["Default"].forEach((item, index) => {
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

    document.querySelectorAll(".accounts-table .delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            accountsList["Default"].splice(index, 1);
            renderAccountsTable(); 
            saveAccountsToStorage();
        });
    });

 
    document.querySelectorAll(".accounts-table .edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            openAccountEditModal(index); 
        });
    });
}
renderProductTable();
renderAccountsTable();
