import {
    market as defaultMarketItems
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
            { username: "username",password: "123456", email: "user@gmail.com", active: true }
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

const resetbtn= document.querySelector(".reset-btn");

//mở form edit tài khoản
function openEditAccountModal(index) {
    const account = accountsList["Tai khoan"][index]; 
    currentAccountEditIndex = index;

    addAccountForm.reset();

    document.getElementById("account-username").value = account.username;
    document.getElementById("account-password").value = account.password;
    document.getElementById("account-email").value = account.email;

    accModal.classList.add("visible");

    accModal.querySelector("h2").textContent = "Chỉnh sửa tài khoản";
    accModal.querySelector("button[type='submit']").textContent = "Lưu thay đổi";
}


// reset mật khẩu
//resetbtn.addEventListener("click",)


//đóng form tài khoản
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
    const password =document.getElementById("account-password").value;
    const email = document.getElementById("account-email").value;

    if (username && password ) {
        const newAccount = { username, password ,email };

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
        alert("Please enter your username and email.");
    }
});

function renderAccountsTable() {
    const tbody = document.querySelector(".accounts-table tbody");
    tbody.innerHTML = "";

    let id = 1;
    accountsList.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${id++}</td>
            <td>${item.username}</td>
            <td>${item.password}</td>
            <td>${item.email}</td>
            <td>${item.active ? "Mở" : "Khóa"}</td>
            <td>
                <button class="reset-btn" title="Reset" data-index="${index}">
                <svg fill="#000000" width="18px" height="18px" viewBox="0 0 512.00 512.00" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M64,256H34A222,222,0,0,1,430,118.15V85h30V190H355V160h67.27A192.21,192.21,0,0,0,256,64C150.13,64,64,150.13,64,256Zm384,0c0,105.87-86.13,192-192,192A192.21,192.21,0,0,1,89.73,352H157V322H52V427H82V393.85A222,222,0,0,0,478,256Z"></path></g></svg>
                </button>
                <button class="status-btn ${item.active ? 'on' : 'off'}" 
                        data-index="${index}">
                    ${item.active ? '<svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>' : '<svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.584 6C15.8124 4.2341 14.0503 3 12 3C9.23858 3 7 5.23858 7 8V10.0288M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C16.8802 10 17.7202 10 18.362 10.327C18.9265 10.6146 19.3854 11.0735 19.673 11.638C20 12.2798 20 13.1198 20 14.8V16.2C20 17.8802 20 18.7202 19.673 19.362C19.3854 19.9265 18.9265 20.3854 18.362 20.673C17.7202 21 16.8802 21 15.2 21H8.8C7.11984 21 6.27976 21 5.63803 20.673C5.07354 20.3854 4.6146 19.9265 4.32698 19.362C4 18.7202 4 17.8802 4 16.2V14.8C4 13.1198 4 12.2798 4.32698 11.638C4.6146 11.0735 5.07354 10.6146 5.63803 10.327C5.99429 10.1455 6.41168 10.0647 7 10.0288Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>'}
                </button>
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
    // xử lý sự kiện cho nút reset
    document.querySelectorAll(".reset-btn").forEach(btn=>{
        btn.addEventListener("click",()=>{
            const index=btn.dataset.index;
            accountsList["Tai khoan"][index].password="123456";
            alert(`Đã reset mật khẩu của tài khoản "${accountsList["Tai khoan"][index].username}" về 123456`)
            renderAccountsTable();
        })
    })

    // Thêm sự kiện cho nút trạng thái
    document.querySelectorAll(".status-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            const user = accountsList["Tai khoan"][index];
            user.active = !user.active; 
            renderAccountsTable();
        });
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
        openEditAccountModal(index);
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