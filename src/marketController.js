export const market = {
  "Danh mục": {
    hidden: false,
    items: [
      { name: "Toán", price: "$45", image: "https://toanmath.com/wp-content/uploads/2024/02/sach-giao-khoa-toan-12-tap-1-ket-noi-tri-thuc-voi-cuoc-song.png", active: true },
      { name: "Giải tích 1", price: "$85", image: "../assets/images/vantai.png", active: true },
      { name: "Xác xuất thống kê", price: "$30", image: "../assets/images/nguyenvantaingu.png", active: true },
      { name: "Lý thuyết đồ thị", price: "$45", image: "../assets/images/ltđt.png", active: true },
      { name: "Triết học", price: "$85", image: "../assets/images/triet.png", active: true },
      { name: "Pháp luật đại cương", price: "$30", image: "../assets/images/pldc.png", active: true },
      { name: "Toán rời rạc", price: "$45", image: "../assets/images/toanroirac.png", active: true },
      { name: "Cờ tướng", price: "$30", image: "../assets/images/vodichthu.png", active: true },
      { name: "Kinh tế chính trị", price: "$45", image: "../assets/images/ktct.png", active: true },
    ]
  },

  "Danh mục 1": {
    hidden: false,
    items: [
      { name: "Cơ sở dữ liệu", price: "$90", image: "../assets/images/rickRoll.png", active: true },
      { name: "Cấu trúc dữ liệu và giải thuật", price: "$40", image: "../assets/icons/jokerBentre.jpg", active: true },
      { name: "Kỹ thuật lập trình", price: "$15", image: "../assets/images/rickRoll.png", active: true },
    ]
  },

  "Danh mục 2": {
    hidden: false,
    items: [
      { name: "Java", price: "$45", image: "../assets/icons/jokerBentre.jpg", active: true },
      { name: "Lập trình hướng đối tượng", price: "$85", image: "../assets/images/rickRoll.png", active: true },
      { name: "JavaScript", price: "$30", image: "../assets/images/rickRoll.png", active: true },
      { name: "C++", price: "$45", image: "../assets/icons/jokerBentre.jpg", active: true },
      { name: "Python", price: "$85", image: "../assets/images/rickRoll.png", active: true },
      { name: "C#", price: "$30", image: "../assets/images/rickRoll.png", active: true },
    ]
  },
};

let searchQuery = "";
let itemsPerPage = 10;
let selectedCategory = null;
let currentPage = 1;

const dataString = localStorage.getItem("adminProducts");
const marketItems = dataString?JSON.parse(dataString):market;
// Hiện thị item trong item-container
function renderMarketItems(page = 1) {
  const container = document.querySelector(".item-container");
  if (!container) return;
  container.innerHTML = "";
  let itemsToFilter="";
  if (selectedCategory) {
        // 1. Nếu đang chọn 1 danh mục
        // Chỉ lấy item NẾU danh mục đó tồn tại VÀ không bị ẩn
        if (marketItems[selectedCategory] && marketItems[selectedCategory].hidden !== true) {
            itemsToFilter = marketItems[selectedCategory].items || [];
        }
        // (Nếu danh mục bị ẩn, itemsToFilter sẽ là mảng rỗng -> không hiển thị gì)
    } else {
        // 2. Nếu đang chọn "All"
        // Lọc và gộp item từ TẤT CẢ các danh mục KHÔNG BỊ ẨN
        itemsToFilter = Object.values(marketItems)
                            .filter(cat => cat.hidden !== true) // <-- LỌC BỎ DANH MỤC ẨN
                            .map(cat => cat.items)
                            .flat();
    }
  
  const nameFiltered = itemsToFilter.filter(item =>
    item.active && item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    const categoryData = marketItems[category];
    if (categoryData.hidden === true) {
        return; // Không hiển thị nút danh mục này
    }
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