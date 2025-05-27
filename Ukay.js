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
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("login-btn1").style.display = "none";
        document.querySelector(".logout-btn").style.display = "inline-block";
        document.querySelector(".profile-btn").style.display = "inline-block";
       // document.querySelector(".register-btn").style.display = "none";
        
    if (data.user.userType === "shop") {
      document.getElementById("cart-icon").style.display = "none";
          document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
     document.getElementById("seller-orders-btn").style.display = "inline-block";
     document.getElementById("osy-rating-btn").style.display = "inline-block";
  }
  if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
      document.getElementById("my-orders-btn").style.display = "inline-block";
      updateCartBadge();
       document.getElementById("customer-address-btn").style.display = "inline-block";
  }
  if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
   document.getElementById("osy-orders-btn1").style.display = "inline-block";
  document.getElementById("osy-orderhistory-btn").style.display = "inline-block";
  document.getElementById("cart-icon").style.display = "none";
}
 
      } else {
        document.getElementById("login-btn").style.display = "block";
         document.getElementById("login-btn1").style.display = "block";
        //document.querySelector(".logout-btn").style.display = "none";
        document.getElementById("add-product-btn").style.display = "none";
        document.querySelector(".ShopDetails-btn").style.display = "none";
        //document.querySelector(".register-btn").style.display = "inline-block";
        document.querySelector(".profile-btn").style.display = "none";
        throw new Error("No user returned");
        
      }
    })
    .catch(err => {
      console.warn("❌ Auto-login failed:", err.message);
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
      if (!response.ok) throw new Error("Error: User Exists/Network error");
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
     document.getElementById("seller-orders-btn").style.display = "inline-block";
     document.getElementById("osy-rating-btn").style.display = "inline-block";
    
  }
        // Optionally disable the login button
        document.getElementById("login-btn").disabled = true;
        document.getElementById("login-btn1").disabled = true;
      } else {
        alert("❌ Login failed: Missing token or user data.");
      
      }
    })
    .catch(error => {
      console.error("❌ Login error:", error);
      alert("❌ Login error: " + error.message);
  
    });
    if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
      updateCartBadge();
      document.getElementById("my-orders-btn").style.display = "inline-block";
      document.getElementById("customer-address-btn").style.display = "inline-block";
  }
   if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
  document.getElementById("osy-orders-btn1").style.display = "inline-block";
  document.getElementById("osy-orderhistory-btn").style.display = "inline-block";
  document.getElementById("cart-icon").style.display = "none";
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
  
 .then(async response => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error("❌ Registration failed: " + (data.message || data.error || "Unknown error"));
  }

  return data;
})

  
  .then(data => {
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

         const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
          alert("✅ Registration success, Welcome: " + data.user.username + "Make sure to complete profile before doing anything!");
        if (modal) modal.hide();

      showLoginStatus(`Registered and logged in as ${data.user.username}. You are a ${data.user.userType}`);
      //document.getElementById("register-dropdown").style.display = "none";
      //document.querySelector(".register-btn").style.display = "none";
      document.getElementById("login-btn").style.display = "none";
      document.getElementById("login-btn1").style.display = "none";
      document.querySelector(".logout-btn").style.display = "inline-block";
      document.querySelector(".profile-btn").style.display = "inline-block";
      if (data.user.userType === "shop") {
        document.getElementById("cart-icon").style.display = "none";
        document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
     document.getElementById("seller-orders-btn").style.display = "inline-block";
     document.getElementById("osy-rating-btn").style.display = "inline-block";
    
  }if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
      updateCartBadge();
      document.getElementById("my-orders-btn").style.display = "inline-block";
      document.getElementById("customer-address-btn").style.display = "inline-block";
  } if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
  document.getElementById("osy-orders-btn1").style.display = "inline-block";
  document.getElementById("osy-orderhistory-btn").style.display = "inline-block";
  document.getElementById("cart-icon").style.display = "none";
}
    } else {
      alert("❌ Registration failed.");
    
    }
  })
  .catch(error => {
    console.error("❌ Registration error:", error);
    alert("❌ Error: " + error.message);
  
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

    alert("✅ Logged out successfully!");
    showLoginStatus(`Bye, You are now logged out.`);

    // Reset UI state
    document.querySelector(".logout-btn").style.display = "none";
    document.getElementById("login-btn").style.display = "block";
     document.getElementById("login-btn1").style.display = "block";
     document.getElementById("cart-icon").style.display = "inline-block";
    document.getElementById("add-product-btn").style.display = "none";
    document.querySelector(".ShopDetails-btn").style.display = "none";
    document.querySelector(".profile-btn").style.display = "none";
   //document.querySelector(".register-btn").style.display = "inline-block";
       document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
      document.getElementById("osy-orders-btn").style.display = "none";
    document.getElementById("osy-orders-btn1").style.display = "none";
       document.getElementById("seller-orders-btn").style.display = "none";
       document.getElementById("osy-rating-btn").style.display = "none";

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
    if (!response.ok) throw new Error("Check credentials");
    return response.json();
  })
  .then(data => {
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

         const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
          alert("✅ Login success, Welcome: " + data.user.username);
        if (modal) modal.hide();

        // Success message
        showLoginStatus(`Welcome, ${data.user.username}! You are a ${data.user.userType}.`);

      document.getElementById("login-btn").style.display = "none";
       document.getElementById("login-btn1").style.display = "none";
     // document.getElementById("login-dropdown").style.display = "none";
     // document.querySelector(".register-btn").style.display = "none";
      document.querySelector(".logout-btn").style.display = "block";
      document.querySelector(".profile-btn").style.display = "inline-block";

        if (data.user.userType === "shop") {
          document.getElementById("cart-icon").style.display = "none";
              document.getElementById("my-orders-btn").style.display = "none";
      document.getElementById("customer-address-btn").style.display = "none";
    document.getElementById("add-product-btn").style.display = "inline-block";
    document.querySelector(".ShopDetails-btn").style.display = "inline-block";
     document.getElementById("seller-orders-btn").style.display = "inline-block";
     document.getElementById("osy-rating-btn").style.display = "inline-block";
   
  }if (data.user.userType === "customer") {
      document.getElementById("cart-icon").style.display = "inline-block";
      updateCartBadge();
      document.getElementById("my-orders-btn").style.display = "inline-block";
       document.getElementById("customer-address-btn").style.display = "inline-block";
  }  if (data.user.userType === "delivery") {
  document.getElementById("osy-orders-btn").style.display = "inline-block";
  document.getElementById("osy-orders-btn1").style.display = "inline-block";
  document.getElementById("osy-orderhistory-btn").style.display = "inline-block";
  document.getElementById("cart-icon").style.display = "none";
}
  
    } else {
      alert("❌ Login failed.");
    }
  })
  .catch(error => {
    console.error("❌ Login error:", error);
    alert("❌ Login error: " + error.message);
  
  });
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
      alert("❌ Failed to update like: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("❌ Like toggle error:", err);
    alert("❌ Request failed: " + err.message);
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
    console.error("❌ Add to cart error:", err);
    alert("❌ Failed to add to cart: " + err.message);
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
    console.error("❌ Get cart error:", err);
    alert("❌ Failed to load cart: " + err.message);
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
  .catch(err => alert("❌ Failed to update cart: " + err.message));
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
    alert("❌ Failed to remove item: " + err.message);
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
    if (data.error) {
      // Server-side error message
      alert("❌ " + data.error);
      return;
    }

    if (!data.success && !data.orders) {
      alert("❌ Checkout failed. Please try again.");
      return;
    }

    alert("✅ Checkout successful!");
    const modal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
    modal.hide();

    updateCartBadge(); // optional: refresh cart badge if you use one
  })
  .catch(err => {
    console.error("❌ Checkout error:", err);
    alert("❌ Failed to checkout: " + err.message);
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
    console.error("❌ Failed to update cart badge:", err);
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
    throw new Error(data.message || "❌ Image upload failed.");
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
    console.error("❌ Add product error:", err);
    alert("❌ Failed: " + err.message);
  }
}

function openProfileModal() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
      preview.style.display = "none";
    } else {
      preview.style.display = "block";
    }

    widget.onUploadComplete((info) => {
      const url = info.cdnUrl + "-/preview/200x200/";
      document.getElementById("profile-image").value = url;
      preview.src = url;
      preview.style.display = "block";
    });

    document.getElementById("uploadcare-inputProfilePic").value = profile.file || "";
    document.getElementById("profile-firstName").value = profile.firstName || "";
    document.getElementById("profile-middleName").value = profile.middleName || "";
    document.getElementById("profile-lastName").value = profile.lastName || "";
    document.getElementById("profile-email").value = profile.email || "";
    document.getElementById("profile-mobile").value = profile.phone_no || "";
    document.getElementById("profile-address").value = profile.address || "";

    // ✅ Show/hide shop input group based on userType
    const shopField = document.getElementById("profile-shop-group");
    if (user.userType === "shop") {
      document.getElementById("profile-shop").value = profile.shopName || "";
      shopField.style.display = "block";
    } else {
      shopField.style.display = "none";
    }

    document.getElementById("profile-success").style.display = "none";

    const modal = new bootstrap.Modal(document.getElementById("profileModal"));
    modal.show();
  })
  .catch(err => {
    console.error("❌ Profile fetch error:", err);
    alert("❌ Failed to fetch profile.");
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
    console.error("❌ Update error:", err);
    alert("❌ Profile update failed: " + err.message);
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
    console.error("❌ Address fetch error:", err);
    alert("❌ Failed to load addresses: " + err.message);
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
    console.error("❌ Add address error:", err);
    alert("❌ Failed to add address: " + err.message);
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
    console.error("❌ Add address error:", err);
    alert("❌ Failed to add address: " + err.message);
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
      alert("❌ Failed to update default address.");
    }
  })
  .catch(err => {
    console.error("❌ Set default error:", err);
    alert("❌ Error: " + err.message);
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
      alert("❌ Delete failed.");
    }
  })
  .catch(err => {
    console.error("❌ Delete error:", err);
    alert("❌ Error: " + err.message);
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

      const status = order.status?.toLowerCase() || "unknown";
      const statusBadge = `<span class="badge bg-secondary text-capitalize">${status}</span>`;
      const productSummary = order.products?.map(p => p.name).join(", ") || "No products";

      let actionButtons = "";

      if (status === "pending" || status === "Pending") {
        {
  order.status?.toLowerCase() === "pending"
    ? `<button class="btn btn-sm btn-danger me-2" onclick="cancelOrder('${order.id}')">Cancel</button>`
    : order.status?.toLowerCase() === "delivered"
    ? `<button class="btn btn-sm btn-success" onclick="confirmReceive('${order.id}')">Confirm Delivery</button>`
    : ""
}
      } else if (status === "deployed") {
        actionButtons = `<button class="btn btn-sm btn-warning" onclick="confirmReceive('${order.id}')">Cancel Order</button>`;
      }
      else if (status === "delivered") {
        actionButtons = `<button class="btn btn-sm btn-success" onclick="confirmReceive('${order.id}')">Confirm Delivery</button>`;
      }
const statuz = status?.toLowerCase();
const statusLabels = {
  accepted: `<span class="badge bg-warning">En-route, delivery on the way</span>`,
  completed: `<span class="badge bg-success">Delivered. Thank you for supporting local</span>`,
  pending: `<span class="badge bg-secondary">Processing Order</span>`
};


      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>OSY Partner Delivery Name:</strong> ${order.delivery?.firstName || "<small>Finding</small>"} ${order.delivery?.lastName || "<small>OSY Partner</small>"}<br>
            <strong>Items:</strong> ${productSummary}<br>
            <strong>Shop name:</strong> ${order.shop?.shopName|| "—"}<br>
            <strong>Total amount payable: </strong> <small>(incl. delivery fee:)</small>  ₱ ${order.totalProductPrice+order.deliveryPrice|| "—"}<br>
           <strong>Status:</strong> ${statusLabels[statuz] || statusBadge}
          </div>
          <div>${actionButtons}</div>
        </div>
      `;

      list.appendChild(item);
    });
  })
  .catch(err => {
    console.error("❌ Get orders error:", err);
    list.innerHTML = "<p class='text-danger'>❌ Failed to load orders.</p>";
  });
}

function confirmReceive(orderId) {
  if (!confirm("Mark this order as received?")) return;

  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/receiveOrder`, {
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
      alert("✅ Order marked as received.");
      openOrdersModal(); // refresh
    } else {
      alert("❌ Failed to confirm: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("❌ Confirm receive error:", err);
    alert("❌ Error: " + err.message);
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
      alert("❌ Failed to cancel: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("❌ Cancel order error:", err);
    alert("❌ Error: " + err.message);
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
    console.error("❌ Address fetch failed:", err);
    document.getElementById("customer-address-list").innerHTML = `<p class="text-danger">❌ Failed to load addresses.</p>`;
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
      alert("❌ Failed to add address.");
    }
  })
  .catch(err => {
    console.error("❌ Add address error:", err);
    alert("❌ Error adding address: " + err.message);
  });
}

function openOsyOrdersModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("osyOrdersModal"));
  modal.show();

  loadOsyOrders();
}

function loadOsyOrders() {
  const token = localStorage.getItem("token");

  // Containers
  const availableContainer = document.getElementById("osy-available-orders");
  const acceptedContainer = document.getElementById("osy-my-orders");

  availableContainer.innerHTML = "<p>Loading available orders...</p>";
  acceptedContainer.innerHTML = "<p>Loading your accepted orders...</p>";

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.profile?.user_id;

  Promise.all([
    fetch(`${API_BASE}/getDeployedOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    }).then(res => res.json()),

    fetch(`${API_BASE}/getOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    }).then(res => res.json())
  ])
  .then(([deployedData, acceptedData]) => {
    const available = (deployedData.orders || []).filter(o =>
      (!o.delivery_id || o.delivery_id === null) &&
      o.status?.toLowerCase() === "deployed"
    );

    const accepted = (acceptedData.orders || []).filter(o =>
      o.delivery_id === userId &&
      ["accepted", "deployed"].includes(o.status?.toLowerCase())
    );

    // ✅ Available Orders
    availableContainer.innerHTML = "";
    if (available.length === 0) {
      availableContainer.innerHTML = "<p class='text-muted'>No available orders.</p>";
    } else {
      available.forEach(order => {
        const customerName = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim();
        const shopName = order.shop?.shopName || "Unknown";
        const barangay = order.address?.barangay || "Unknown";

        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
            <strong>Order details:</strong><br>
            <strong>Deliver to:</strong> ${order.address?.barangay || "—"}<br>
            <strong>Street:</strong> ${order.address?.streetAddress || "—"}<br>
            <strong>Landmark:</strong> ${order.address?.landmark || "—"}<br>
            <strong>Deliver From:</strong> ${order.shop?.address || "—"}<br>
            <strong>Shop Name:</strong> ${order.shop?.name || "—"}<br>
            <strong>Product:</strong> ${order.products?.[0]?.name || "—"}<br>
            <strong>Total Price:</strong> ₱${order.totalProductPrice || "—"}<br>
            <strong>Your Incentive:</strong> ₱${order.deliveryPrice || "—"}<br>
            <strong>Status:</strong> <span class="badge bg-success">${order.status}</span><br>
            <button class="btn btn-sm btn-primary mt-2" onclick="acceptOsyOrder('${order.id}')">Accept</button>
          </div>
        `;
        availableContainer.appendChild(card);
      });
    }

    // ✅ Accepted Orders
    acceptedContainer.innerHTML = "";
    if (accepted.length === 0) {
      acceptedContainer.innerHTML = "<p class='text-muted'>No active orders yet.. Add now!</p>";
    } else {
      accepted.forEach(order => {
        const status = order.status?.toLowerCase();
        const showDeliverBtn = status === "accepted";

        const customerName = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim();
        const shopName = order.shop?.shopName || "Unknown";
        const barangay = order.address?.barangay || "Unknown";

        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
           <strong>Order details:</strong><br>
            <strong>Customer Name:</strong> ${customerName}<br>
            <strong>Deliver to:</strong> ${order.address?.barangay || "—"}<br>
            <strong>Street:</strong> ${order.address?.streetAddress || "—"}<br>
            <strong>Landmark:</strong> ${order.address?.landmark || "—"}<br>
            <strong>Deliver From:</strong> ${order.shop?.address || "—"}<br>
            <strong>Shop:</strong> ${shopName}<br>
            <strong>Product:</strong> ${order.products?.[0]?.name || "—"}<br>
            <strong>Total Price:</strong> ₱${order.totalProductPrice || "—"}<br>
            <strong>Your Incentive:</strong> ₱${order.deliveryPrice || "—"}<br>
            <strong>Status:</strong> <span class="badge bg-info">${order.status}</span><br>
            ${showDeliverBtn ? `<button class="btn btn-sm btn-success mt-2" onclick="deliverOrder('${order.id}')">Mark as Delivered</button>` : ""}
          </div>
        `;
        acceptedContainer.appendChild(card);
      });
    }
  })
  .catch(err => {
    console.error("❌ Error loading OSY orders:", err);
    availableContainer.innerHTML = "<p class='text-danger'>❌ Failed to load available orders.</p>";
    acceptedContainer.innerHTML = "<p class='text-danger'>❌ Failed to load accepted orders.</p>";
  });
}


function acceptOsyOrder(orderId) {
  const token = localStorage.getItem("token");

  console.log("Accepting order ID:", orderId);

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
  
      if (data.error) {
      // 🚫 Show error if present in response
      alert("❌ Failed to accept order: " + data.error);
    } else {
      alert("✅ Order accepted.");
      loadOsyOrders(); // refresh orders
    }
  })
  .catch(err => {
    console.error("Accept order error:", err);
    alert("Error: " + err);
  });
}


function openSellerOrdersModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("sellerOrdersModal"));
  modal.show();
  loadSellerOrders();
}
function loadSellerOrders() {
  const token = localStorage.getItem("token");

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
    const pendingContainer = document.getElementById("seller-pending-orders");
    const deployedContainer = document.getElementById("seller-deployed-orders");

    const orders = data.orders || [];

    // Normalize status to lowercase
    const pending = orders.filter(o => o.status?.toLowerCase() === "pending");
    const active = orders.filter(o => {
      const status = o.status?.toLowerCase();
     return status === "accepted" || status === "deployed" || status === "delivered" || status === "completed" || status === "received" || status === "canceled";
      
    });

    pendingContainer.innerHTML = "";
    deployedContainer.innerHTML = "";

    // Pending orders with Accept/Reject buttons
    if (pending.length === 0) {
      pendingContainer.innerHTML = "<p class='text-muted'>No pending orders.</p>";
    } else {
      pending.forEach(order => {
        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
           
            <strong>Customer Name:</strong> ${order.customer?.firstName || "N/A"} ${order.customer?.lastName || "N/A"}<br>
            <strong>Deliver to:</strong> ${order.address?.barangay || "—"}<br>
            <strong>Landmark:</strong> ${order.address?.landmark || "—"}<br>
            <strong>Product:</strong> ${order.products?.[0]?.name || "—"}<br>
            <strong>Street:</strong> ${order.address?.streetAddress || "—"}<br>
            <strong>Total Price:</strong> ${order.totalProductPrice || "—"}<br>
            <strong>OSY Fee:</strong> ${order.deliveryPrice || "—"}<br>
            <div class="mt-2 d-flex gap-2">
              <button class="btn btn-sm btn-success" onclick="deployOrder('${order.id}')">Accept</button>
              <button class="btn btn-sm btn-danger" onclick="rejectOrder('${order.id}')">Reject</button>
            </div>
          </div>
        `;
        pendingContainer.appendChild(card);
      });
    }

    // Accepted or Deployed orders
    if (active.length === 0) {
      deployedContainer.innerHTML = "<p class='text-muted'>No active orders.</p>";
    } else {
      active.forEach(order => {
        const status = order.status?.toLowerCase();
let statusBadge = `<span class="badge bg-secondary">${order.status}</span>`;
let actionButtons = "";
if (status === "deployed") {
  statusBadge = `<span class="badge bg-success">${order.status}</span>`;
} else if (status === "accepted") {
  statusBadge = `<span class="badge bg-info">${order.status}</span>`;
} else if (status === "delivered") {
  statusBadge = `<span class="badge bg-success">${order.status}</span>`;
}
if (status === "received") {
  actionButtons += `<button class="btn btn-sm btn-primary me-2" onclick="completeOrder('${order.id}')">Complete Order</button>`;
}
if (status === "completed") {
  actionButtons += `<button class="btn btn-sm btn-warning" onclick="openRateOsyModal('${order.id}', '${order.delivery?.user_id}')">Rate OSY</button>`;
}

        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
              <strong>Customer Name:</strong> ${order.customer?.firstName || "N/A"} ${order.customer?.lastName || "N/A"}<br>
            <strong>Deliver to:</strong> ${order.address?.barangay || "—"}<br>
            <strong>Landmark:</strong> ${order.address?.landmark || "—"}<br>
            <strong>Product:</strong> ${order.products?.[0]?.name || "—"}<br>
            <strong>Street:</strong> ${order.address?.streetAddress || "—"}<br>
            <strong>Total Price:</strong> ${order.totalProductPrice || "—"}<br>
            <strong>OSY Fee:</strong> ${order.deliveryPrice || "—"}<br>
            <strong>Status:</strong> ${statusBadge}<br>
            <strong>To:</strong> ${order.address?.barangay || "—"}</br>
            <div class="mt-2 d-flex gap-2">${actionButtons}</div>
          </div>
        `;
        deployedContainer.appendChild(card);
      });
    }
  })
  .catch(err => {
    console.error("❌ Seller orders load error:", err);
    document.getElementById("seller-pending-orders").innerHTML = "<p class='text-danger'>❌ Failed to load orders.</p>";
  });
}

//seller accept order acceptorder
function deployOrder(orderId) {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/deployOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order_id: orderId })
  })
  .then(res => res.json())
  .then(data => {
    

    
      alert("✅ Order deployed.");
        loadSellerOrders();
      
  })
  .catch(err => {
    console.error("Deploy order error:", err);
    alert("Error: " + err.message);
  });
}

function rejectOrder(orderId) {
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
      alert("❌ Order rejected.");
      loadSellerOrders();
    } else {
      alert("❌ Failed to reject order.");
    }
  })
  .catch(err => {
    console.error("❌ Cancel order error:", err);
    alert("❌ Error: " + err.message);
  });
}
function deliverOrder(orderId) {
  const token = localStorage.getItem("token");

  if (!confirm("Are you sure? Mark this order as delivered?")) return;

  fetch(`${API_BASE}/deliverOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order_id: orderId })
  })
  .then(res => res.json())
  .then(data => {
    //FIX BUG ERROR NO CATCHING PARAMS only tagging bug fix me 
      alert("✅ Order marked as delivered. Order added to history.");
      loadOsyOrders(); // reload OSY modal view
    
  })
  .catch(err => {
    console.error("❌ Deliver error:", err);
    alert("❌ Error: " + err.message);
  });
}

function confirmReceive(orderId) {
  const token = localStorage.getItem("token");

  if (!confirm("Confirm you have received this order?")) return;

  fetch(`${API_BASE}/receiveOrder`, {
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
      alert("✅ Order marked as received.");
      openOrdersModal(); // refresh modal list
    } else {
      alert("❌ Failed to confirm: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("❌ Receive order error:", err);
    alert("❌ Error: " + err.message);
  });
}

function completeOrder(orderId) {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/completeOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order_id: orderId })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Order marked as completed.");
    loadSellerOrders(); // Refresh orders
  })
  .catch(err => {
    console.error("Complete order error:", err);
    alert("Error: " + err.message);
  });
}

function openOsyRatingsModal(preFillOrder = null) {
  const token = localStorage.getItem("token");
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("osyRatingsModal"));
  modal.show();

  const container = document.getElementById("osy-ratings-container");
  container.innerHTML = "<p class='text-muted'>Loading...</p>";

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

    const toRate = orders.filter(o => 
      o.status?.toLowerCase() === "completed" && !o.review
    );

    const rated = orders.filter(o => o.review);

    container.innerHTML = "";

    // ✅ Render "to be rated"
    if (toRate.length > 0) {
      container.innerHTML += "<h5 class='mt-3'>Rate OSY</h5>";
      toRate.forEach(order => {
        container.innerHTML += `
          <div class="card mb-2">
            <div class="card-body">
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>OSY:</strong> ${order.delivery?.firstName || ""} ${order.delivery?.lastName || ""}<br>
              <label>Rating (1–5):</label>
              <input type="number" class="form-control mb-2" id="rate-${order.id}-rating" min="1" max="5">
              <label>Comment:</label>
              <textarea class="form-control mb-2" id="rate-${order.id}-comment"></textarea>
              <button class="btn btn-sm btn-primary" onclick="submitOsyRating('${order.id}', '${order.delivery_id}')">Submit Rating</button>
            </div>
          </div>
        `;
      });
    }

    // ✅ Render previous ratings
    if (rated.length > 0) {
      container.innerHTML += "<h5 class='mt-4'>Previously Rated</h5>";
      rated.forEach(order => {
        container.innerHTML += `
          <div class="card mb-2">
            <div class="card-body">
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>OSY:</strong> ${order.delivery?.firstName || ""} ${order.delivery?.lastName || ""}<br>
              <strong>Rating:</strong> ${order.review?.rating}/5<br>
              <strong>Comment:</strong> ${order.review?.comment || "—"}
            </div>
          </div>
        `;
      });
    }

    if (toRate.length === 0 && rated.length === 0) {
      container.innerHTML = "<p class='text-muted'>No OSY ratings available.</p>";
    }

    // 🧩 Optional: Pre-fill a specific one
    if (preFillOrder) {
      setTimeout(() => {
        const rateInput = document.getElementById(`rate-${preFillOrder.orderId}-rating`);
        if (rateInput) rateInput.focus();
      }, 300);
    }
  })
  .catch(err => {
    console.error("❌ Ratings load error:", err);
    container.innerHTML = "<p class='text-danger'>❌ Failed to load OSY ratings.</p>";
  });
}

function submitOsyRating(orderId, deliveryId) {
   console.log("➡️ Called submitOsyRating:", orderId, deliveryId);
  const token = localStorage.getItem("token");
  const rating = document.getElementById(`rate-${orderId}-rating`).value;
  const comment = document.getElementById(`rate-${orderId}-comment`).value;

  fetch(`${API_BASE}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      order_id: orderId,
      reviewee_id: deliveryId,
      rating: Number(rating),
      comment
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ OSY rated successfully.");
    openOsyRatingsModal(); // Refresh ratings
  })
  .catch(err => {
    console.error("❌ Rating error:", err);
    alert("❌ Failed to submit rating.");
  });
}

// Triggered from seller modal
function openRateOsyModal(orderId, deliveryId) {
  const sellerModal = bootstrap.Modal.getInstance(document.getElementById("sellerOrdersModal"));
  if (sellerModal) sellerModal.hide();

  setTimeout(() => {
    openOsyRatingsModal({ orderId, deliveryId });
  }, 300);
}

function toggleDrawer() {
  const drawer = document.getElementById("side-drawer");
  const wrapper = document.getElementById("site-wrapper");
  const logo = document.getElementById("site-logo");

  drawer.classList.toggle("open");
  wrapper.classList.toggle("shifted");
  logo.classList.toggle("logo-shift");
}

function openAuthModal() {
  const modal = new bootstrap.Modal(document.getElementById('authModal'));
  modal.show();
}

function openOsyHistoryModal() {
  const token = localStorage.getItem("token");
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("osyHistoryModal"));
  modal.show();

  const container = document.getElementById("osy-history-container");
  container.innerHTML = "<p class='text-muted'>Loading...</p>";

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

      const history = orders.filter(o => {
        const status = o.status?.toLowerCase();
        return status === "delivered" || status === "completed";
      });

      container.innerHTML = "";

      if (history.length === 0) {
        container.innerHTML = "<p class='text-muted'>No delivered or completed orders.</p>";
        return;
      }

      history.forEach(order => {
       const status = order.status?.toLowerCase() || "—";
let statusText = "";
let badgeColor = "secondary";

if (status === "delivered") {
  statusText = "Delivered – Pending confirmation of customer";
  badgeColor = "info";
} else if (status === "completed") {
  statusText = "Completed – Thank you for helping the seller and your proactive service to the community";
  badgeColor = "success";
} else {
  statusText = status;
}

const statusBadge = `<span class="badge bg-${badgeColor}">${statusText}</span>`;
        const card = document.createElement("div");
        card.className = "card mb-2";
        card.innerHTML = `
          <div class="card-body">
            <strong>Customer Name:</strong> ${order.customer?.firstName || "N/A"} ${order.customer?.lastName || "N/A"}<br>
            <strong>Deliver to:</strong> ${order.address?.barangay || "—"}<br>
            <strong>Landmark:</strong> ${order.address?.landmark || "—"}<br>
            <strong>Street:</strong> ${order.address?.streetAddress || "—"}<br>
            <strong>Product:</strong> ${order.products?.[0]?.name || "—"}<br>
            <strong>Total Price:</strong> ${order.totalProductPrice || "—"}<br>
            <strong>OSY Fee:</strong> ${order.deliveryPrice || "—"}<br>
            <strong>Status:</strong> ${statusBadge}
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("❌ Order history load error:", err);
      container.innerHTML = "<p class='text-danger'>❌ Failed to load order history.</p>";
    });
}