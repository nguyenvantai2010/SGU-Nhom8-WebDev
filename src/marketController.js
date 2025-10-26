export const marketItems = {
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
    
    // ... other Category 1 items
  ],
  "Danh mục 1": [
    { name: "Cơ sở dữ liệu", price: "$90", image: "../assets/images/rickRoll.png" },
    { name: "Cấu trúc dữ liệu và giải thuật", price: "$40", image: "../assets/icons/jokerBentre.jpg" },
    { name: "kỹ thuật lập trình", price: "$15", image: "../assets/images/rickRoll.png" },
    // ... other Category 2 items
  ],
  "Danh mục 2": [
    { name: "java", price: "$45", image: "../assets/icons/jokerBentre.jpg" },
    { name: "lập trình hướng đối tượng", price: "$85", image: "../assets/images/rickRoll.png" },
    { name: "java script", price: "$30", image: "../assets/images/rickRoll.png" },
    { name: "c++", price: "$45", image: "../assets/icons/jokerBentre.jpg" },
    { name: "python", price: "$85", image: "../assets/images/rickRoll.png" },
    { name: "C#", price: "$30", image: "../assets/images/rickRoll.png" },

    // ... other Category 1 items
  ],
};

let searchQuery = "";
let itemsPerPage = 10;
let selectedCategory = null;
let currentPage = 1;

// Hiện thị item trong item-container
function renderMarketItems(page = 1) {
  const container = document.querySelector(".item-container");
  if (!container) return;
  container.innerHTML = "";

  const filteredItems = selectedCategory
    ? marketItems[selectedCategory] || []
    : Object.values(marketItems).flat(); // Lấy ra các item thuộc danh mục(category) nếu ko tìm thấy category thì chọn tất cả

  const nameFiltered = filteredItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = nameFiltered.slice(start, end); // Mỗi trang có 1-10 item

  // Tạo item mới rồi bỏ vào item-container
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

  // rander thanh trang
  renderPagination(nameFiltered.length, page, itemsPerPage);
}

// Hiện thị thanh trang
function renderPagination(totalItems, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Tổng số trang trong category đã chọn
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  // Tạo nút chuyển trang
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

  // Tạo nút quay lại
  paginationContainer.appendChild(createButton("Previous", currentPage - 1, currentPage === 1));

  // Insert các nút còn lại vào thanh trang
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.appendChild(createButton(i, i));
  }

  // Tạo nút chuyển trang tiếp theo 
  paginationContainer.appendChild(createButton("Next", currentPage + 1, currentPage === totalPages));
}

// Hiện thị thanh danh mục(category)
function renderCategoryBar() {
  const categoryBar = document.getElementById("categoryBar");
  if (!categoryBar) return;

  categoryBar.innerHTML = "";

  // Add "All" option => Hiện thị tất cả item
  const allBtn = document.createElement("div");
  allBtn.textContent = "All";
  allBtn.classList.add("category-btn");
  allBtn.addEventListener("click", () => {
    selectedCategory = null;
    renderMarketItems(1);
  });
  categoryBar.appendChild(allBtn);

  // Add Danh mục(categories) từ marketItems 
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

// Đối với admin thì sử dụng hàm này để thêm item vào marketItems
function addItemToCategory(item, category) {
  if (!marketItems[category]) {
    marketItems[category] = [];
  }
  marketItems[category].push(item);
}

// Đối với admin thì sử dụng hàm này để xóa item khỏi marketItems
function removeItemFromCategory(itemName, category) {
  if (!marketItems[category]) return;
  marketItems[category] = marketItems[category].filter(item => item.name !== itemName);
}

// Tìm kiếm item
// Tìm kiếm item
const searchInput = document.getElementById("searchInput");
if (searchInput) { // <-- THÊM DÒNG NÀY
  searchInput.addEventListener("input", e => {
   searchQuery = e.target.value.trim();
   renderMarketItems(1);
  });
} // <-- VÀ DÒNG NÀY

// Thay đổi các hiện thị khi window bị thay đổi khích thước
window.addEventListener("resize", () => {
   renderMarketItems(1); // Re-render on resize
});

// Load lại trang
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryBar();
  renderMarketItems(1);
});

// Click danh mục
document.querySelectorAll(".category-bar li").forEach(li => {
  li.addEventListener("click", () => {
    selectedCategory = li.textContent.trim();
    renderMarketItems(1);
  });
});