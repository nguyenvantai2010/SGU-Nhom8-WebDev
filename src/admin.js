import {
    market as defaultMarketItems,
} from './marketController.js';


//ham chuyen tab
function setActiveTab(tab){
    document.querySelectorAll(".admin-category-bar li").forEach(li => li.classList.remove("active"));
    document.getElementById(`${tab}-tab`).classList.add("active");

    const marketPanel = document.getElementById("market");
    const accountsPanel = document.getElementById("accounts");

    if(tab == "market") {
        marketPanel.style.display = "block";
        accountsPanel.style.display= "none";
    }
    if(tab == "accounts"){
        marketPanel.style.display = "none";
        accountsPanel.style.display = "block";
    }
}

document.getElementById("market-tab").addEventListener("click",() => setActiveTab("market"));
document.getElementById("accounts-tab").addEventListener("click",() => setActiveTab("accounts"));

// ham load san pham da luu 
function loadsanpham() {
    const dataString = localStorage.getItem("adminProducts");
    if(dataString){
        return JSON.parse(dataString); //chuyen string thanh object
    }
    return JSON.parse(JSON.stringify(defaultMarketItems));
}

//ham luu san pham
function luusanpham() {
    const dataString = JSON.stringify(marketItems); // chuyen object sang string
    localStorage.setItem("adminProducts",dataString);
}
 let marketItems = loadsanpham();

 let danhmucht = Object.keys(marketItems)[0];// danh muc hien tai la mac dinh
 let suasphtindex = null;
 const chondanhmuc = document.getElementById("category-select");

//render bang san pham
function renderbangsp(){
    const tbody =document.querySelector(".product-table tbody")
    tbody.innerHTML = "";

    let id=1;
    const spderd= marketItems[danhmucht] || [];

    spderd.forEach((item,index) => {
        const tr =document.createElement("tr");
        tr.innerHTML= `
        <td>${id++}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td><img src="${item.image}" class="item-image"></td>
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

 //render danh muc vao phan chon danh muc
function renderchondanhmuc(){
   if(!chondanhmuc) return;
   chondanhmuc.innerHTML = "";
   Object.keys(marketItems).forEach(tendm =>{
    const option = document.createElement("option");
    option.value = tendm;
    option.textContent = tendm;
    if(tendm === danhmucht){
        option.selected=true;
    }
    chondanhmuc.appendChild(option);
   });
}

const modal = document.getElementById("addform"); //modal dung chung cho ca them va sua san pham
const formthemsp = document.getElementById("add-pr-frm");
const nutthemsp =document.getElementById("add-pr-btn");
const nutdongmodal = document.getElementById("close-pr-frm-btn");

//mo form them san pham
function momodal(){
    formthemsp.reset();
    suasphtindex=null;
    modal.classList.add("visible");
    modal.querySelector("h2").textContent ="Add new Product";
    modal.querySelector("button[type='submit']").textContent="Add Product";
}

//mo form sua san pham 
function momodalsua(index){
    const item = marketItems[danhmucht][index];

    document.getElementById("product-name").value=item.name;
    document.getElementById("product-price").value=item.price.replace('$',' ');
    document.getElementById("product-image").value=item.image;

    suasphtindex =index;
    modal.classList.add("visible");
    modal.querySelector("h2").textContent="Edit product";
    modal.querySelector("button[type='submit']").textContent="Save changes";
}

//dong form them san pham
function dongmodal(){
    modal.classList.remove("visible");
}

//xu ly su kien khi click nut them san pham
nutthemsp.addEventListener("click",momodal);
nutdongmodal.addEventListener("click",dongmodal);


//click vao nen thi dong form
modal.addEventListener("click", (e)=>{
    if(e.target === modal) dongmodal;
});

//xy ly su kien cho nut nop san pham
function nopsanpham(e){
    
    const name=document.getElementById("product-name").value;
    const giatri=document.getElementById("product-price").value;
    const price="$"+giatri;
    const image = document.getElementById("product-image").value;
    const spmoi = {name, price , image};

    if(suasphtindex !== null){
        marketItems[danhmucht][suasphtindex] =spmoi;
    }
    else {
        marketItems[danhmucht].push(spmoi);
    }
    renderbangsp();
    dongmodal();
    suasphtindex=null;
    luusanpham();
}

formthemsp.addEventListener("submit",nopsanpham);
if (chondanhmuc) {
    chondanhmuc.addEventListener("change", (e) => {
        danhmucht = e.target.value; // Cập nhật danh mục đang chọn
        renderbangsp(); // Vẽ lại bảng sản phẩm cho danh mục mới
    });
}
//load tai khoan da luu
function loadtkdaluu(){
    const dataString = localStorage.getItem("adminAccounts");
    if(dataString){
        return JSON.parse(dataString);
    }
    return {
        "Tai khoan": [
            {usernam: "admin", password: "secret123"}
        ]
    };
}

//luu tai khoan
function luutk(){
    const dataString = JSON.stringify(dstk);
    localStorage.setItem("adminAccounts",dataString);
}

//render bang tai khoan
function renderbangtk(){
    const tbody =document.querySelector(".accounts-table tbody");
    tbody.innerHTML ="";

    let id=1;
    dstk["Tai khoan"].forEach((item,index) =>{ 
        const tr=document.createElement("tr");
        tr.innerHTML=`
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

let dstk = loadtkdaluu();
let suatkht =null;

const accmodal = document.getElementById("addAccountForm");
const formthemtk = document.getElementById("add-acc-frm");
const nutthemtk = document.querySelector(".add-accounts-bt");
const dongaccmodal = document.getElementById("close-acc-frm-btn");

//mo modal them tai khoan
function  momodaltk(){
    formthemtk.reset();
    suatkht=null;
    accmodal.classList.add("visible");
    accmodal.querySelector("h2").textContent ="Add New Account";
    accmodal.querySelector("button[type='submit']").textContent = "Add Account";
}

//mo form sua tai khoan
function momodalsuatk(index){
    const item=dstk["Tai khoan"][index];
    document.getElementById("account-username").value = item.username;
    document.getElementById("account-password").value = item.password;

    suatkht=index;
    accmodal.classList.add("visible");
    accmodal.querySelector("h2").textContent = "Edit account";
    accmodal.querySelector("button[type='submit']").textContent= "Save";
}

//dong frm them tai khoan
function dongmodaltk(){
    accmodal.classList.remove("visible");
}

//xu ly su kien cho phan tai khoan 
nutthemtk.addEventListener("click",momodaltk);
dongaccmodal.addEventListener("click",dongmodaltk);

//dong modal khi click vao nen
accmodal.addEventListener("click", (e) =>{
    if(e.target === accmodal){
        dongmodaltk();
    }
});

//nut submit them tai khoan
formthemtk.addEventListener("submit", (e)=>{
    const username =document.getElementById("account-username").value;
    const password =document.getElementById("account-password").value;

    if(username && password){
        const tkmoi= {username, password};

        if(suatkht !==null){
            dstk["Tai khoan"][suatkht]=tkmoi;
        }
        else {
            dstk["Tai khoan"].push(tkmoi);
        }
        renderbangtk();
    dongmodaltk();
    luutk();
    suatkht=null;
    }
    else {
        alert("Vui long nhap day du tai khoan va mat khau");
    }
});

//xu ly su kien xoa cho 2 modal
//modal san pham
document.querySelector(".product-table tbody").addEventListener("click", (e)=>{
    const nutsua =e.target.closest(".edit-btn");
    if(nutsua){
        const index=nutsua.dataset.index;
        momodalsua(index);
        return;
    }
    const nutxoa =e.target.closest(".delete-btn");
    if(nutxoa){
        if(confirm("Ban co chac muon xoa san pham nay khong?")){
            const index=nutxoa.dataset.index;
            marketItems[danhmucht].splice(index,1);
            renderbangsp();
            luusanpham();
        }
    }
});
//modal tai khoan
document.querySelector(".accounts-table tbody").addEventListener("click", (e)=>{
    const nutsua=e.target.closest(".edit-btn");
    if(nutsua){
        const index=nutsua.dataset.index;
        momodalsuatk(index);
        return;
    }
    const nutxoa=e.target.closest(".delete-btn");
    if(nutxoa){
        const index=nutxoa.dataset.index;
        const account=dstk["Tai khoan"][index];
        if (account.username === "admin") {
            alert("Bạn không thể xóa tài khoản 'admin' mặc định!");
            return;
        }
    
    if (confirm(`Bạn có chắc muốn xóa tài khoản '${account.username}'?`)) {
            dstk["Tai khoan"].splice(index, 1);
            renderbangtk();
            luutk();
        }
    }
});
renderbangtk();
renderbangsp();
renderchondanhmuc();
setActiveTab("market");