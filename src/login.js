document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  message.textContent = "";
  message.style.color = "red";

  // Admin login
  if (username === "admin" && password === "secret123") {
    // Lưu thông tin admin (optional - nếu muốn hiển thị tên admin trên navbar)
    const adminUser = {
      id: 'admin',
      username: 'admin',
      name: 'Administrator',
      email: 'admin@system.com',
      role: 'admin'
    };
    localStorage.setItem("user", JSON.stringify(adminUser));
    
    window.location.href = "../pages/admin.html";
    console.log("Welcome admin");
    return;
  }

  // User login
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const foundUser = users.find(u => u.username === username && u.password === password && u.active);

  if (foundUser) {
    message.style.color = "green";
    message.textContent = "Login successful! Redirecting...";

    localStorage.setItem("currentUser", JSON.stringify(foundUser));

  
    const userForNavbar = {
      id: foundUser.id || foundUser.username,
      name: foundUser.name || foundUser.username,
      email: foundUser.email || `${foundUser.username}@example.com`,
      username: foundUser.username,
    };
    localStorage.setItem("user", JSON.stringify(userForNavbar));

    // ⏳ Chuyển hướng sang trang chủ sau 1.5 giây
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
  } else {
    message.textContent = "Invalid username or password.";
  }
});