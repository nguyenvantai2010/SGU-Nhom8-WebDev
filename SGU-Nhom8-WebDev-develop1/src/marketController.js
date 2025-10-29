export const market = {
  "Danh mục": [
    { name: "Toán", price: "$45", image: "https://toanmath.com/wp-content/uploads/2024/02/sach-giao-khoa-toan-12-tap-1-ket-noi-tri-thuc-voi-cuoc-song.png" },
    { name: "Giải tích 1", price: "$85", image: "../assets/images/vantai.png" },
    { name: "Xác xuất thống kê", price: "$30", image: "../assets/images/nguyenvantaingu.png" },
    { name: "Lý thuyết đồ thị", price: "$45", image: "../assets/images/ltđt.png" },
    { name: "Triết học", price: "$85", image: "../assets/images/triet.png" },
    { name: "Pháp luật đại cương", price: "$30", image: "../assets/images/pldc.png" },
    { name: "Toán rời rạc", price: "$45", image: "../assets/images/toanroirac.png" },
    { name: "Cờ tướng", price: "$30", image: "../assets/images/vodichthu.png" },
    { name: "Kinh tế chính trị", price: "$45", image: "../assets/images/ktct.png" },
  ],
  "Danh mục 1": [
    { name: "Cơ sở dữ liệu", price: "$90", image: "../assets/images/csdl.png" },
    { name: "Cấu trúc dữ liệu và giải thuật", price: "$40", image: "../assets/images/ctdlgt.png" },
    { name: "Kỹ thuật lập trình", price: "$15", image: "../assets/images/rickRoll.png" },
  ],
  "Danh mục 2": [
    { name: "Java", price: "$45", image: "../assets/images/java.png" },
    { name: "Lập trình hướng đối tượng", price: "$85", image: "../assets/images/oop.png" },
    { name: "JavaScript", price: "$30", image: "../assets/images/js.png" },
    { name: "C++", price: "$45", image: "../assets/images/c++.png" },
    { name: "Python", price: "$85", image: "../assets/images/python.png" },
    { name: "C#", price: "$30", image: "../assets/images/cc.png" },
  ],
  
};

let searchQuery = "";
let itemsPerPage = 10;
let selectedCategory = null;
let currentPage = 1;

const dataString = localStorage.getItem("adminProducts");
const marketItems = dataString ? JSON.parse(dataString) : market;

// ===============================
// HIỂN THỊ ITEM
// ===============================
function renderMarketItems(page = 1) {
  const container = document.querySelector(".item-container");
  if (!container) return;
  container.innerHTML = "";

  const filteredItems = selectedCategory
    ? marketItems[selectedCategory] || []
    : Object.values(marketItems).flat();

  const nameFiltered = filteredItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = nameFiltered.slice(start, end);

  pageItems.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("market-item");
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-image" />
      <div class="item-info">
        <h3 class="item-name">${item.name}</h3>
        <p class="item-price">${item.price}</p>
      </div>
    `;
    container.appendChild(itemDiv);
  });

  renderPagination(nameFiltered.length, page, itemsPerPage);
}

// ===============================
// PHÂN TRANG (CÓ POSITION FIXED)
// ===============================
function renderPagination(totalItems, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const createButton = (label, page, disabled = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.classList.add("page-btn");
    if (page === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      renderMarketItems(page);
    });
    return btn;
  };

  // Previous - giữa
  paginationContainer.appendChild(createButton("Previous", currentPage - 1, currentPage === 1));

  // Các số trang
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.appendChild(createButton(i, i));
  }

  // Next - giữa
  paginationContainer.appendChild(createButton("Next", currentPage + 1, currentPage === totalPages));
}

// ===============================
// HIỂN THỊ DANH MỤC
// ===============================
function renderCategoryBar() {
  const categoryBar = document.getElementById("categoryBar");
  if (!categoryBar) return;
  categoryBar.innerHTML = "";

  const allBtn = document.createElement("div");
  allBtn.textContent = "All";
  allBtn.classList.add("category-btn");
  allBtn.addEventListener("click", () => {
    selectedCategory = null;
    renderMarketItems(1);
  });
  categoryBar.appendChild(allBtn);

  Object.keys(marketItems).forEach(category => {
    const li = document.createElement("div");
    li.textContent = category;
    li.classList.add("category-btn");
    li.addEventListener("click", () => {
      selectedCategory = category;
      renderMarketItems(1);
    });
    categoryBar.appendChild(li);
  });
}

// ===============================
// SỰ KIỆN TÌM KIẾM
// ===============================
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.trim();
    renderMarketItems(1);
  });
}

// ===============================
// KHỞI TẠO
// ===============================
window.addEventListener("resize", () => renderMarketItems(1));
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryBar();
  renderMarketItems(1);
});
