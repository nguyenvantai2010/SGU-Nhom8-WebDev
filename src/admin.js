import {
  marketItems,
  addItemToCategory,
  removeItemFromCategory,
  renderMarketItems
} from "../src/marketController";


document.getElementById("market-tab").addEventListener("click", () => {
  setActiveTab("market");
});

document.getElementById("accounts-tab").addEventListener("click", () => {
  setActiveTab("accounts");
});

function setActiveTab(tab) {
    document.querySelectorAll(".admin-category-bar li").forEach(li => li.classList.remove("active"));
    document.getElementById(`${tab}-tab`).classList.add("active");

    const content = document.getElementById("admin-section-content");
    if (tab === "market") {
      content.innerHTML = "<p>Welcome to Market Control.</p>";
    } else if (tab === "accounts") {
      content.innerHTML = "<p>Welcome to Accounts Control.</p>";
    }
}