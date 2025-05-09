const API_BASE = "https://ukay.ovh/api";
loadProducts();
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    fetch(`${API_BASE}/ping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid or expired token");
      document.querySelector(".logout-btn").style.display = "none";
      return res.json();
    })
    .then(data => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        showLoginStatus(`Welcome back, ${data.user.username}!`);
        document.querySelector(".login-btn").style.display = "none";
        document.querySelector(".logout-btn").style.display = "inline-block";
    
      } else {
        document.querySelector(".login-btn").style.display = "block";
        document.querySelector(".logout-btn").style.display = "none";
        throw new Error("No user returned");
        
      }
    })
    .catch(err => {
      console.warn("Auto-login failed:", err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.querySelector(".logout-btn").style.display = "none";
    });
  }
});


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
function submitRegister() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const userType = document.getElementById("register-usertype").value;

  if (!username || !password || !userType) {
    alert("Please fill in all fields.");
    return;
  }

  fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, userType })
  })
  .then(response => {
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  })
  .then(data => {
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showLoginStatus(`Registered and logged in as ${data.user.username}`);
      document.getElementById("register-dropdown").style.display = "none";
      document.querySelector(".login-btn").style.display = "none";
      document.querySelector(".logout-btn").style.display = "inline-block";
    } else {
      alert("Registration failed.");
    }
  })
  .catch(error => {
    console.error("Registration error:", error);
    alert("Error: " + error.message);
  });
}

// Logout function
function handleLogout() {
  fetch(`${API_BASE}/logout`, {
    method: "POST"
  })
  .then(response => response.json())
  .then(data => {
    // Clear local storage session
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");
    showLoginStatus(`Bye, You are now logged out.`);

    // Reset UI state
    document.querySelector(".logout-btn").style.display = "none";
    document.querySelector(".login-btn").style.display = "block";
  })
  .catch(error => console.error("Logout error:", error));
}



function toggleLoginDropdown() {
  const dropdown = document.getElementById("login-dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function submitLogin() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

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
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showLoginStatus(`Welcome, ${data.user.username}!`);
      document.querySelector(".login-btn").style.display = "none";
      document.getElementById("login-dropdown").style.display = "none";
      document.querySelector(".logout-btn").style.display = "block";
    } else {
      alert("Login failed.");
    }
  })
  .catch(error => {
    console.error("Login error:", error);
    alert("Login error: " + error.message);
  });
}

function toggleRegisterDropdown() {
  const dropdown = document.getElementById("register-dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}


function loadProducts() {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/getProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  })
  .then(responseData => {
    console.log("Received data:", responseData);
  
    const products = responseData.products; // or adjust if the key is different
    if (!Array.isArray(products)) {
      console.error("Expected an array but got:", products);
      return;
    }
  
    const list = document.getElementById("product-list");
    list.innerHTML = "";
  
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
  
      const img = document.createElement("img");
      img.src = product.imagePath || "placeholder.jpg";
      img.alt = product.name;
  
      const details = document.createElement("div");
      details.className = "product-details";
  
      const name = document.createElement("h3");
      name.textContent = product.name;
  
      const description = document.createElement("p");
      description.textContent = product.description || "";
  
      const price = document.createElement("p");
      if (product.promo) {
        price.innerHTML = `<span class="old-price">₱${product.price.toFixed(2)}</span><span class="price-tag"> ₱${product.promo.toFixed(2)}</span>`;
      } else {
        price.innerHTML = `<span class="price-tag">₱${product.price.toFixed(2)}</span>`;
      }
  
      const shop = document.createElement("p");
      shop.textContent = product.shop?.shopName ? `Shop: ${product.shop.shopName}` : "";
  
      details.appendChild(name);
      details.appendChild(description);
      details.appendChild(price);
      details.appendChild(shop);
  
      card.appendChild(img);
      card.appendChild(details);
      list.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error loading products:", error);
  });
}