const marketItems = {
	"Default": [
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		// ... other Category 1 items
	],
	"Category 2": [
		{ name: "Floor Rug", price: "$90", image: "../assets/images/rickRoll.png" },
		{ name: "Table Lamp", price: "$40", image: "../assets/images/rickRoll.png" },
		{ name: "Succulent Plant", price: "$15", image: "../assets/images/rickRoll.png" },
		// ... other Category 2 items
	],
    "Category 3": [
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		{ name: "Vintage Lamp", price: "$45", image: "../assets/images/rickRoll.png" },
		{ name: "Wooden Chair", price: "$85", image: "../assets/images/rickRoll.png" },
		{ name: "Ceramic Vase", price: "$30", image: "../assets/images/rickRoll.png" },
		// ... other Category 1 items
	],
};

let searchQuery = "";
let itemsPerPage = 10;
let selectedCategory = null;
let currentPage = 1;

function renderMarketItems(page = 1) {
  const container = document.querySelector(".item-container");
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

	paginationContainer.appendChild(createButton("Previous", currentPage - 1, currentPage === 1));

	for (let i = 1; i <= totalPages; i++) {
		paginationContainer.appendChild(createButton(i, i));
	}

	paginationContainer.appendChild(createButton("Next", currentPage + 1, currentPage === totalPages));
}

function renderCategoryBar() {
	const categoryBar = document.getElementById("categoryBar");
	if (!categoryBar) return;

	categoryBar.innerHTML = "";

	// Add "All" option
	const allBtn = document.createElement("div");
	allBtn.textContent = "All";
	allBtn.classList.add("category-btn");
	allBtn.addEventListener("click", () => {
		selectedCategory = null;
		renderMarketItems(1);
	});
	categoryBar.appendChild(allBtn);

	// Add categories from dictionary
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

function addItemToCategory(item, category) {
	if (!marketItems[category]) {
		marketItems[category] = [];
	}
	marketItems[category].push(item);
}

function removeItemFromCategory(itemName, category) {
	if (!marketItems[category]) return;
	marketItems[category] = marketItems[category].filter(item => item.name !== itemName);
}

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.trim();
  renderMarketItems(1);
});

window.addEventListener("resize", () => {
 	 renderMarketItems(1); // Re-render on resize
});

document.addEventListener("DOMContentLoaded", () => {
	renderCategoryBar();
	renderMarketItems(1);
});

document.querySelectorAll(".category-bar li").forEach(li => {
	li.addEventListener("click", () => {
		selectedCategory = li.textContent.trim();
		renderMarketItems(1);
	});
});
