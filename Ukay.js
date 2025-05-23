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
          document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
  }
  if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
      document.getElementById("my-orders-btn").style.display = "inline-block";
      updateCartBadge();
       document.getElementById("customer-address-btn").style.display = "inline-block";
  }
  if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
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
                document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
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
      updateCartBadge();
      document.getElementById("my-orders-btn").style.display = "inline-block";
      document.getElementById("customer-address-btn").style.display = "inline-block";
  }
   if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
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
        document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
    
  }if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
      updateCartBadge();
      document.getElementById("my-orders-btn").style.display = "inline-block";
      document.getElementById("customer-address-btn").style.display = "inline-block";
  } if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
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
       document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
      document.getElementById("osy-orders-btn").style.display = "none";

// 🔄 Clear like state memory
Object.keys(likedProducts).forEach(key => delete likedProducts[key]);

// 🔁 Reset all heart icons to "unliked" (outline) but keep like counts
document.querySelectorAll(".product-card button").forEach(btn => {
  if (btn.innerHTML.includes("❤️") || btn.innerHTML.includes("🤍")) {
    const count = btn.querySelector(".like-count")?.textContent || "0";
    btn.innerHTML = `🤍 <span class="like-count">${count}</span>`;
  }
});
   loadProducts();
   const cartCount = document.getElementById("cart-count");
if (cartCount) cartCount.textContent = "0";
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
              document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
   
  }if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
      updateCartBadge();
      document.getElementById("my-orders-btn").style.display = "inline-block";
       document.getElementById("customer-address-btn").style.display = "inline-block";
  }  if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
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
    const heartIcon = likedProducts[product.id] ? "❤️" : "🤍";
likeBtn.innerHTML = `${heartIcon} <span class="like-count">${product.likes || 0}</span>`;
   likeBtn.onclick = () => heartProduct(product.id, likeBtn);

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

const likedProducts = {};  // productId -> true/false
function heartProduct(productId, buttonElement) {
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }

  const currentLiked = likedProducts[productId] || false;
  const newLiked = !currentLiked; // toggle like

  fetch(`${API_BASE}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      product_id: productId,
      like: newLiked
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.product) {
      // ✅ Update local state
      likedProducts[productId] = newLiked;
const heartIcon = newLiked ? "❤️" : "🤍";
buttonElement.innerHTML = `${heartIcon} <span class="like-count">${data.product.likes}</span>`;
      // ✅ Update UI
      const likeCount = data.product.likes;
      const likeCountSpan = buttonElement.querySelector(".like-count");

      if (likeCountSpan) {
        likeCountSpan.textContent = likeCount;
      }

      // Optionally: toggle button color/text if you want more visual feedback
      if (newLiked) {
        buttonElement.classList.add("btn-danger");
        buttonElement.classList.remove("btn-outline-danger");
      } else {
        buttonElement.classList.remove("btn-danger");
        buttonElement.classList.add("btn-outline-danger");
      }
    } else {
      alert("Failed to update like: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("Like toggle error:", err);
    alert("Request failed: " + err.message);
  });
}


function addToCart(productId) {
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }

  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/addToCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: 1
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Product added to cart!");
    updateCartBadge(); // optional: update item count badge
  })
  .catch(err => {
    console.error("Add to cart error:", err);
    alert("Failed to add to cart: " + err.message);
  });
}


function ToggleCart() {
  if (!isLoggedIn()) {
    showLoginModal();
    return;
  }

  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/getCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    const items = data.cart || [];
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let total = 0;

 items.forEach(item => {
  const product = item.product || {};
  const name = product.name || "Unnamed";
  const price = product.promo ?? product.price;
  const subtotal = price * item.quantity;
  total += subtotal;
  const imageUrl = product.imagePath ? `${product.imagePath}-/preview/100x100/` : "https://via.placeholder.com/100";

  const div = document.createElement("div");
  div.className = "mb-3 border-bottom pb-2";

  div.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <img src="${imageUrl}" alt="${name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;" />

      <div class="flex-grow-1">
        <strong>${name}</strong><br/>
        <small>
          Qty: 
          <input type="number" min="1" value="${item.quantity}" onchange="updateCartQuantity('${item.product_id}', this.value)" style="width: 60px;" />
        </small>
      </div>

      <div class="text-end">
        <span>₱${subtotal.toFixed(2)}</span>
        <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.product_id}')">🗑</button>
      </div>
    </div>
  `;

  container.appendChild(div);
});

    document.getElementById("cart-total").textContent = `Total: ₱${total.toFixed(2)}`;

    const modal = new bootstrap.Modal(document.getElementById("cartModal"));
    modal.show();
  })
  .catch(err => {
    console.error("Get cart error:", err);
    alert("Failed to load cart: " + err.message);
  });
}

function updateCartQuantity(productId, quantity) {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/updateCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: parseInt(quantity, 10)
    })
  })
  .then(() => ToggleCart())
  .catch(err => alert("Failed to update cart: " + err.message));
}

function removeFromCart(productId) {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`${API_BASE}/updateCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: 0
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("✅ Removed from cart:", data);
    updateCartBadge();

    // Re-fetch cart after brief delay to avoid modal stacking
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
    if (modalInstance) modalInstance.hide();

    setTimeout(() => {
      ToggleCart();
    }, 200);
  })
  .catch(err => {
    console.error("❌ Remove item error:", err);
    alert("Failed to remove item: " + err.message);
  });
}
function checkoutCart() {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/checkoutCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Checkout successful!");
    const modal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
    modal.hide();
  })
  .catch(err => {
    console.error("Checkout error:", err);
    alert("Failed to checkout: " + err.message);
  });
}
function updateCartBadge() {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`${API_BASE}/getCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    const count = (data.cart || []).length;
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = count;
  })
  .catch(err => {
    console.error("Failed to update cart badge:", err);
  });
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

function loadShopAddresses() {
  const token = localStorage.getItem("token");

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
    const addressList = data.addresses || [];
    const container = document.getElementById("shop-address-list");
    container.innerHTML = "";

    if (addressList.length === 0) {
      container.innerHTML = `<p class="text-muted">No addresses added yet.</p>`;
    } else {
      addressList.forEach((addr, index) => {
        const isDefault = addr.default === true;
        const badge = isDefault ? `<span class="badge bg-success ms-2">Default</span>` : "";

        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
            <h6 class="card-title">${addr.name || "Address " + (index + 1)} ${badge}</h6>
            <p class="mb-0"><strong>Barangay:</strong> ${addr.barangay || "—"}</p>
            <p class="mb-0"><strong>Street:</strong> ${addr.streetAddress || "—"}</p>
            <p class="mb-3"><strong>Landmark:</strong> ${addr.landmark || "—"}</p>
            <div class="d-flex gap-2">
              ${!isDefault ? `<button class="btn btn-sm btn-outline-primary" onclick="setAsDefaultAddress('${addr.id}')">Set as Default</button>` : ""}
              <button class="btn btn-sm btn-outline-danger" onclick="deleteAddress('${addr.id}')">Delete</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }
  })
  .catch(err => {
    console.error("Address fetch error:", err);
    alert("Failed to load addresses: " + err.message);
  });
}

function openShopDetailsModal() {
  document.getElementById("ShopDetails-success").style.display = "none";

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("ShopDetailsModal"));
  modal.show();

  loadShopAddresses(); // ✅ just load data inside
}

function submitShopDetailsUpdate() {
  const token = localStorage.getItem("token");

  const payload = {
    address: {
      name: document.getElementById("ShopDetails_name").value.trim(),
      barangay: document.getElementById("ShopDetails_Barangay").value.trim(),
      streetAddress: document.getElementById("ShopDetails_Street").value.trim(),
      landmark: document.getElementById("ShopDetails_Landmark").value.trim()
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
  .then(async res => {
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || data.error || "Unknown error");

    document.getElementById("ShopDetails-success").style.display = "block";
    document.getElementById("ShopDetails-form").reset();

    loadShopAddresses(); // ✅ refresh contents without re-showing modal
  })
  .catch(err => {
    console.error("Add address error:", err);
    alert("Failed to add address: " + err.message);
  });
}

function submitShopDetailsUpdate() {
  const token = localStorage.getItem("token");

  const payload = {
    address: {
      name: document.getElementById("ShopDetails_name").value.trim(),
      barangay: document.getElementById("ShopDetails_Barangay").value.trim(),
      streetAddress: document.getElementById("ShopDetails_Street").value.trim(),
      landmark: document.getElementById("ShopDetails_Landmark").value.trim()
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
  .then(async res => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || "Unknown error");
    }

    document.getElementById("ShopDetails-success").style.display = "block";
    document.getElementById("ShopDetails-form").reset();
    openShopDetailsModal(); // refresh the updated list
  })
  .catch(err => {
    console.error("Add address error:", err);
    alert("Failed to add address: " + err.message);
  });
}

function setAsDefaultAddress(targetId) {
  const token = localStorage.getItem("token");

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
    const updatedAddresses = (data.addresses || []).map(addr => ({
      ...addr,
      default: addr.id === targetId // set true for selected
    }));

    return fetch(`${API_BASE}/addAddress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ addresses: updatedAddresses })
    });
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      openShopDetailsModal(); // refresh list
    } else {
      alert("Failed to update default address.");
    }
  })
  .catch(err => {
    console.error("Set default error:", err);
    alert("Error: " + err.message);
  });
}
function deleteAddress(targetId) {
  if (!confirm("Delete this address?")) return;

  const token = localStorage.getItem("token");

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
    const remaining = (data.addresses || []).filter(addr => addr.id !== targetId);

    return fetch(`${API_BASE}/addAddress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ addresses: remaining })
    });
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      openShopDetailsModal(); // refresh
    } else {
      alert("Delete failed.");
    }
  })
  .catch(err => {
    console.error("Delete error:", err);
    alert("Error: " + err.message);
  });
}


function openOrdersModal() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("ordersModal"));
  modal.show();

  const list = document.getElementById("orders-list");
  list.innerHTML = "<p class='text-muted'>Loading your orders...</p>";

  fetch(`${API_BASE}/getOrders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    const orders = data.orders || [];
    if (orders.length === 0) {
      list.innerHTML = "<p class='text-muted'>You have no orders yet.</p>";
      return;
    }

    list.innerHTML = "";
    orders.forEach(order => {
      const item = document.createElement("div");
      item.className = "list-group-item";

      const status = `<span class="badge bg-secondary">${order.status}</span>`;

      const productSummary = order.products?.map(p => p.name).join(", ") || "No products";

      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Items:</strong> ${productSummary}<br>
            <strong>Status:</strong> ${status}
          </div>
          ${order.status === "Pending" ? `<button class="btn btn-sm btn-danger" onclick="cancelOrder('${order.id}')">Cancel</button>` : ""}
        </div>
      `;

      list.appendChild(item);
    });
  })
  .catch(err => {
    console.error("Get orders error:", err);
    list.innerHTML = "<p class='text-danger'>Failed to load orders.</p>";
  });
}

function cancelOrder(orderId) {
  if (!confirm("Cancel this order?")) return;

  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/cancelOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order_id: orderId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Order cancelled.");
      openOrdersModal(); // refresh modal
    } else {
      alert("Failed to cancel: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("Cancel order error:", err);
    alert("Error: " + err.message);
  });
}


function openCustomerAddressModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("customerAddressModal"));
  modal.show();
  loadCustomerAddresses();
}

function loadCustomerAddresses() {
  const token = localStorage.getItem("token");

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
    const list = document.getElementById("customer-address-list");
    list.innerHTML = "";

    const addresses = data.addresses || [];
    if (addresses.length === 0) {
      list.innerHTML = `<p class="text-muted">No saved addresses yet.</p>`;
      return;
    }

    addresses.forEach((addr, i) => {
      const isDefault = addr.default === true;
      const badge = isDefault ? `<span class="badge bg-success ms-2">Default</span>` : "";

      const div = document.createElement("div");
      div.className = "card mb-2";
      div.innerHTML = `
        <div class="card-body">
          <h6>${addr.name || `Address ${i + 1}`} ${badge}</h6>
          <p><strong>Barangay:</strong> ${addr.barangay || "—"}</p>
          <p><strong>Street:</strong> ${addr.streetAddress || "—"}</p>
          <p><strong>Landmark:</strong> ${addr.landmark || "—"}</p>
          <div class="d-flex gap-2">
            ${!isDefault ? `<button class="btn btn-sm btn-outline-primary" onclick="setDefaultAddress('${addr.id}')">Set as Default</button>` : ""}
            <button class="btn btn-sm btn-outline-danger" onclick="deleteAddress('${addr.id}')">Delete</button>
          </div>
        </div>
      `;
      list.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Address fetch failed:", err);
    document.getElementById("customer-address-list").innerHTML = `<p class="text-danger">Failed to load addresses.</p>`;
  });
}

function submitCustomerAddress() {
  const token = localStorage.getItem("token");

  const payload = {
    address: {
      name: document.getElementById("custAddr_name").value.trim(),
      barangay: document.getElementById("custAddr_barangay").value.trim(),
      streetAddress: document.getElementById("custAddr_street").value.trim(),
      landmark: document.getElementById("custAddr_landmark").value.trim()
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
    if (data.address) {
      document.getElementById("customer-address-success").style.display = "block";
      document.getElementById("customerAddress-form").reset();
      loadCustomerAddresses();
    } else {
      alert("Failed to add address.");
    }
  })
  .catch(err => {
    console.error("Add address error:", err);
    alert("Error adding address: " + err.message);
  });
}

function openOsyOrdersModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("osyOrdersModal"));
  modal.show();

  loadOsyOrders();
}

function loadOsyOrders() {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/getDeployedOrders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    const availableContainer = document.getElementById("osy-available-orders");
    const acceptedContainer = document.getElementById("osy-my-orders");

    const orders = data.orders || [];

    // Split orders into accepted and available
    const available = orders.filter(o => !o.delivery_id);
    const accepted = orders.filter(o => o.delivery_id); // assuming this field is filled when accepted

    availableContainer.innerHTML = "";
    acceptedContainer.innerHTML = "";

    if (available.length === 0) {
      availableContainer.innerHTML = "<p class='text-muted'>No available orders.</p>";
    } else {
      available.forEach(order => {
        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Barangay:</strong> ${order.address?.barangay || "Unknown"}<br>
            <button class="btn btn-sm btn-primary mt-2" onclick="acceptOsyOrder('${order.id}')">Accept</button>
          </div>
        `;
        availableContainer.appendChild(card);
      });
    }

    if (accepted.length === 0) {
      acceptedContainer.innerHTML = "<p class='text-muted'>You haven't accepted any orders.</p>";
    } else {
      accepted.forEach(order => {
        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Status:</strong> <span class="badge bg-info">${order.status}</span><br>
            <strong>To:</strong> ${order.address?.barangay || "Unknown"}
          </div>
        `;
        acceptedContainer.appendChild(card);
      });
    }
  })
  .catch(err => {
    console.error("Load OSY orders error:", err);
    document.getElementById("osy-available-orders").innerHTML = "<p class='text-danger'>Failed to load orders.</p>";
  });
}

function acceptOsyOrder(orderId) {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/acceptOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order_id: orderId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success || data.order) {
      alert("Order accepted.");
      loadOsyOrders(); // refresh both columns
    } else {
      alert("Failed to accept order: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("Accept order error:", err);
    alert("Failed: " + err.message);
  });
}