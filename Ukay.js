const API_BASE = "https://ukay.ovh/api";

// Login function
function handleLogin() {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");
  
    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      if (data.token && data.user) {
        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
  
        // Display success message on the page
        showLoginStatus(`Welcome, ${data.user.username}! You are now logged in.`);
  
        // Optionally disable the login button
        document.querySelector(".login-btn").disabled = true;
      } else {
        alert("Login failed: Missing token or user data.");
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      alert("Login error: " + error.message);
    });
  }
  
  // Helper to show login status
  function showLoginStatus(message) {
    let statusDiv = document.getElementById("login-status");
    if (!statusDiv) {
      statusDiv = document.createElement("div");
      statusDiv.id = "login-status";
      statusDiv.style.marginTop = "20px";
      statusDiv.style.color = "green";
      document.body.appendChild(statusDiv);
    }
    statusDiv.textContent = message;
}

// Register function
function handleRegister() {
  const username = prompt("Choose username:");
  const password = prompt("Choose password:");
  const userType = prompt("Enter user type (e.g., user/admin):");

  fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, userType })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Registration successful!");
    } else {
      alert("Registration failed: " + (data.message || "Unknown error"));
    }
  })
  .catch(error => console.error("Register error:", error));
}

// Logout function
function handleLogout() {
  fetch(`${API_BASE}/logout`, {
    method: "POST"
  })
  .then(response => response.json())
  .then(data => {
    alert("Logged out successfully!");
  })
  .catch(error => console.error("Logout error:", error));
}