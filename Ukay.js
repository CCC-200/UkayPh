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
      document.querySelector(".profile-btn").style.display = "none";
      return res.json();
    })
    .then(data => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        showLoginStatus(`Welcome back, ${data.user.username}! You are a ${data.user.userType}. `);
        document.querySelector(".login-btn").style.display = "none";
        document.querySelector(".logout-btn").style.display = "inline-block";
        document.querySelector(".profile-btn").style.display = "inline-block";
        document.querySelector(".register-btn").style.display = "none";
        
    if (data.user.userType === "shop") {
      document.getElementById("cart-icon").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
  }
  if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
  }
 
      } else {
        document.querySelector(".login-btn").style.display = "block";
        document.querySelector(".logout-btn").style.display = "none";
        document.getElementById("add-product-btn").style.display = "none";
        document.querySelector(".ShopDetails-btn").style.display = "none";
        document.querySelector(".register-btn").style.display = "inline-block";
        document.querySelector(".profile-btn").style.display = "none";
        throw new Error("No user returned");
        
      }
    })
    .catch(err => {
      console.warn("Auto-login failed:", err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.querySelector(".logout-btn").style.display = "none";
      document.getElementById("add-product-btn").style.display = "none";
      document.querySelector(".ShopDetails-btn").style.display = "none";
     
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
        showLoginStatus(`Welcome, ${data.user.username}! You are now logged in as a ${data.user.userType}.`);
        document.querySelector(".profile-btn").style.display = "inline-block";
          if (data.user.userType === "shop") {
            document.getElementById("cart-icon").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
    
  }
        // Optionally disable the login button
        document.querySelector(".login-btn").disabled = true;
      } else {
        alert("Login failed: Missing token or user data.");
        const errorMessage = data.error || data.message || res.statusText;
      alert("failed: " + (data.message || errorMessage));
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      alert("Login error: " + error.message);
      const errorMessage = data.error || data.message || res.statusText;
      alert("failed: " + (data.message || errorMessage));
    });
    if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
  }
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
      showLoginStatus(`Registered and logged in as ${data.user.username}. You are a ${data.user.userType}`);
      document.getElementById("register-dropdown").style.display = "none";
      document.querySelector(".register-btn").style.display = "none";
      document.querySelector(".login-btn").style.display = "none";
      document.querySelector(".logout-btn").style.display = "inline-block";
      document.querySelector(".profile-btn").style.display = "inline-block";
      if (data.user.userType === "shop") {
        document.getElementById("cart-icon").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
    
  }if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
  }
    } else {
      alert("Registration failed.");
      const errorMessage = data.error || data.message || res.statusText;
      alert("failed: " + (data.message || errorMessage));
    }
  })
  .catch(error => {
    console.error("Registration error:", error);
    alert("Error: " + error.message);
    const errorMessage = data.error || data.message || res.statusText;
      alert("failed: " + (data.message || errorMessage));
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
    document.getElementById("add-product-btn").style.display = "none";
    document.querySelector(".ShopDetails-btn").style.display = "none";
    document.querySelector(".profile-btn").style.display = "none";
   document.querySelector(".register-btn").style.display = "inline-block";
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

      showLoginStatus(`Welcome, ${data.user.username}! You are a ${data.user.userType}.`);
      document.querySelector(".login-btn").style.display = "none";
      document.getElementById("login-dropdown").style.display = "none";
      document.querySelector(".register-btn").style.display = "none";
      document.querySelector(".logout-btn").style.display = "block";
      document.querySelector(".profile-btn").style.display = "inline-block";

        if (data.user.userType === "shop") {
          document.getElementById("cart-icon").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
   
  }if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
  }
  
    } else {
      alert("Login failed.");
    }
  })
  .catch(error => {
    console.error("Login error:", error);
    alert("Login error: " + error.message);
    const errorMessage = data.error || data.message || res.statusText;
      alert("failed: " + (data.message || errorMessage));
  });
}

function toggleRegisterDropdown() {
  const dropdown = document.getElementById("register-dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}



let allProducts = []; // global array

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
  .then(response => response.json())
  .then(responseData => {
    const products = responseData.products;
    if (!Array.isArray(products)) {
      console.error("Expected an array but got:", products);
      return;
    }

    allProducts = products; // store for sorting
    renderProducts(allProducts);
  })
  .catch(error => {
    console.error("Error loading products:", error);
  });
}

function renderProducts(products) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
let imageUrl = product.imagePath;
if (imageUrl && imageUrl.includes("ucarecdn.com") && !imageUrl.includes("-/preview/")) {
  imageUrl = imageUrl + "-/preview/600x800/"; // ✅ optimized version
}


    img.src = imageUrl || "placeholder.jpg";



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

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "product-buttons";

    const likeBtn = document.createElement("button");
    likeBtn.className = "btn btn-outline-danger btn-sm me-2";
    likeBtn.innerHTML = `❤️ ${product.likes || 0}`;
    likeBtn.onclick = () => heartProduct(product.id);

    const cartBtn = document.createElement("button");
    cartBtn.className = "btn btn-outline-primary btn-sm";
    cartBtn.innerHTML = "🛒 Add to Cart";
    cartBtn.onclick = () => addToCart(product.id);

    buttonGroup.appendChild(likeBtn);
    buttonGroup.appendChild(cartBtn);

    details.appendChild(name);
    details.appendChild(description);
    details.appendChild(price);
    details.appendChild(shop);
    details.appendChild(buttonGroup);

    card.appendChild(img);
    card.appendChild(details);
    list.appendChild(card);
  });
}

function handleSortChange() {
  const sortOption = document.getElementById("sortSelect").value;
  let sorted = [...allProducts];

  switch (sortOption) {
    case "priceLowHigh":
      sorted.sort((a, b) => (a.promo || a.price) - (b.promo || b.price));
      break;
    case "priceHighLow":
      sorted.sort((a, b) => (b.promo || b.price) - (a.promo || a.price));
      break;
    case "nameAZ":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nameZA":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      sorted = [...allProducts];
  }

  renderProducts(sorted);
}

function applyFilters() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const sortOption = document.getElementById("sortSelect").value;

  let filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    (p.description && p.description.toLowerCase().includes(query)) ||
    (p.tags && p.tags.toLowerCase().includes(query)) ||
    (p.shop?.shopName && p.shop.shopName.toLowerCase().includes(query))
  );

  switch (sortOption) {
    case "priceLowHigh":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "priceHighLow":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "nameAZ":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nameZA":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  renderProducts(filtered);
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  applyFilters();
}


function heartProduct(productId, buttonElement) {
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }

  fetch(`${API_BASE}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ productId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Find the span showing like count in this product card
      const likeCountSpan = buttonElement.querySelector(".like-count");
      if (likeCountSpan) {
        const current = parseInt(likeCountSpan.textContent, 10);
        likeCountSpan.textContent = current + 1;
      }
    } else {
      alert("Failed to like: " + (data.message || "Unknown error"));
      const errorMessage = data.error || data.message || res.statusText;
      alert("failed: " + (data.message || errorMessage));
    }
  })
  .catch(err => console.error("Like error:", err));
}

function addToCart(productId) {
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }
  // Continue with cart logic
  alert("Product added to cart!");
}

function ToggleCart(productId) {
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }
 
}
function ToggleNotifications(productId) {
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }
 
}
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function showLoginModal() {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  loginModal.show();
}

function openAddProductModal() {
  const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
  modal.show();
}

// --- helper: promisified File → base64 string -----------------------------
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);   // data:image/...;base64,XXXX
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("token", token); // if server expects token in body

  const response = await fetch(`${API_BASE}/uploadPhoto`, {
    method: "POST",
    body: formData // ✅ Let browser set the multipart boundary
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed.");
  }

  return data.imagePath || data.path || data.url; // Adjust based on server's response
}


async function submitAddProduct() {
  const token = localStorage.getItem("token");
  const name = document.getElementById("productName").value.trim();
  const description = document.getElementById("Pdesc").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const promo = parseFloat(document.getElementById("productPromo").value);
  const quantity = parseInt(document.getElementById("productQty").value, 10);

  if (!name || isNaN(price) || isNaN(quantity)) {
    alert("Please complete all fields.");
    return;
  }

  const widget = uploadcare.Widget('#uploadcare-input');
  const file = widget.value();

  if (!file) {
    alert("Please upload an image.");
    return;
  }

  try {
    // Wait for Uploadcare to finish processing the file
    const fileInfo = await file.promise(); // ✅ Wait for file upload to complete
    const imageCDNUrl = fileInfo.cdnUrl;   // ✅ Get CDN-hosted image URL

    const payload = {
      productDetails: {
        imagePath: imageCDNUrl,
        name,
        description,
        promo,
        price,
        quantity
      }
    };

    const response = await fetch(`${API_BASE}/addProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Unknown error");
    }

    alert("✅ Product added!");
    document.getElementById("add-product-form").reset();
    bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide();
    loadProducts();
  } catch (err) {
    console.error("Add product error:", err);
    alert("Failed: " + err.message);
  }
}

function openProfileModal() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  fetch(`${API_BASE}/getProfile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    const profile = data.profile || {};


    const widget = uploadcare.Widget('#uploadcare-inputProfilePic');

  const imageUrl = profile.imagePath || "";
document.getElementById("profile-image").value = imageUrl;

const preview = document.getElementById("profile-image-preview");

if (imageUrl) {
  preview.src = imageUrl;
  preview.style.display = "block";
} else {
  preview.style.display = "none";
}


widget.onUploadComplete((info) => {
  const url = info.cdnUrl + "-/preview/200x200/";
  document.getElementById("profile-image").value = url;
  const preview = document.getElementById("profile-image-preview");
  preview.src = url;
  preview.style.display = "block";
});

    document.getElementById("uploadcare-inputProfilePic").value = profile.file || "";
    document.getElementById("profile-firstName").value = profile.firstName || "";
    document.getElementById("profile-middleName").value = profile.middleName || "";
    document.getElementById("profile-lastName").value = profile.lastName || "";
    document.getElementById("profile-email").value = profile.email || "";
    document.getElementById("profile-shop").value = profile.shopName || "";
    document.getElementById("profile-mobile").value = profile.phone_no || "";
    document.getElementById("profile-address").value = profile.address || "";

    document.getElementById("profile-success").style.display = "none";
    const modal = new bootstrap.Modal(document.getElementById("profileModal"));
    modal.show();
  })
  .catch(err => {
    console.error("Profile fetch error:", err);
    alert("Failed to fetch profile.");
    const errorMessage = data.error || data.message || res.statusText;
      alert("failed: " + (data.message || errorMessage));
  });
}

function submitProfileUpdate() {
  const token = localStorage.getItem("token");

  const payload = {
    profile: {
      imagePath: document.getElementById("uploadcare-inputProfilePic").value.trim(),
      firstName: document.getElementById("profile-firstName").value.trim(),
      middleName: document.getElementById("profile-middleName").value.trim(),
      lastName: document.getElementById("profile-lastName").value.trim(),
      email: document.getElementById("profile-email").value.trim(),
      shopName: document.getElementById("profile-shop").value.trim(),
      phone_no: document.getElementById("profile-mobile").value.trim(),
      shopName: document.getElementById("profile-shop").value.trim(),
      address: document.getElementById("profile-address").value.trim()
    }
  };

  fetch(`${API_BASE}/updateProfile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  .then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || "Unknown error");
    }

    document.getElementById("profile-success").style.display = "block";
    loadProducts();  // ✅ now this will run without breaking
  })
  .catch(err => {
    console.error("Update error:", err);
    alert("Profile update failed: " + err.message);
  });
}

function openShopDetailsModal() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  fetch(`${API_BASE}/getAddresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    const shopDetails = data.address || {};

    document.getElementById("ShopDetails_name").value = shopDetails.label || "";
    document.getElementById("ShopDetails_AddressCity").value = shopDetails.location || "";
    document.getElementById("ShopDetails_AddressBarangay").value = shopDetails.barangay || "";

    document.getElementById("ShopDetails-success").style.display = "none";
    const modal = new bootstrap.Modal(document.getElementById("ShopDetailsModal"));
    modal.show();
  })
  .catch(err => {
    console.error("Shop details fetch error:", err);
    alert("Failed to fetch shop details: " + err.message);
  });
}

function submitShopDetailsUpdate() {
  const token = localStorage.getItem("token");

  const payload = {
    address: {
      label: document.getElementById("ShopDetails_name").value.trim(),
      location: document.getElementById("ShopDetails_AddressCity").value.trim(),
      barangay: document.getElementById("ShopDetails_AddressBarangay").value.trim()
    }
  };

  fetch(`${API_BASE}/addAddress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("ShopDetails-success").style.display = "block";
    } else {
      throw new Error(data.message || "Unknown error");
    }
  })
  .catch(err => {
    console.error("Shop details update error:", err);
    alert("Failed to update shop details: " + err.message);
  });
}