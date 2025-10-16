document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  // Simple hardcoded check (replace with real backend later)
  if (username === "admin" && password === "secret123") {
    window.location.href = "../pages/admin.html"; // your secret admin page
    console.log("Welcome admin");
  } else if (username === "user" && password === "userpass") {
    window.location.href = "../pages/market.html"; // regular user dashboard
  } else {
    message.textContent = "Invalid username or password.";
  }
});