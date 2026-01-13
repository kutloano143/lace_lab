let cart = JSON.parse(localStorage.getItem("cart")) || [];

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
}



/* ---------- Helpers ---------- */
function formatZAR(value) {
  return `R${Math.round(value)}`;
}

/* ---------- Cart count ---------- */
function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) count.innerText = cart.length;
}
updateCartCount();

/* ---------- Add product ---------- */
function addProduct(name, price, sizeId, image) {
  const sizeEl = document.getElementById(sizeId);
  const size = sizeEl ? sizeEl.value : "";

  cart.push({ name, price: Number(price), size, image });
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  alert("Added to cart!");
}

/* ---------- Remove / Clear ---------- */
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

/* ---------- Toggle cart view ---------- */
function toggleCart() {
  const products = document.querySelector('.products');
  const cartContainer = document.getElementById('cart-container');
  if (cartContainer.style.display === 'none') {
    products.style.display = 'none';
    cartContainer.style.display = 'block';
    renderCart();
  } else {
    cartContainer.style.display = 'none';
    products.style.display = 'block';
  }
}

/* ---------- Toggle category view ---------- */
function toggleCategory(category) {
  const categoryDiv = document.getElementById(category);
  if (categoryDiv.style.display === 'none') {
    categoryDiv.style.display = 'block';
  } else {
    categoryDiv.style.display = 'none';
  }
}

/* ---------- Render cart ---------- */
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.innerText = formatZAR(0);
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += Number(item.price);

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div style="flex:1;">
          <h3>${item.name}</h3>
          <p>Size: ${item.size}</p>
          <p>${formatZAR(item.price)}</p>
        </div>
        <button onclick="removeItem(${index})" style="padding:10px 14px;">
          ✖
        </button>
      </div>
    `;
  });

  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.innerText = formatZAR(total);
}
renderCart();

/* ---------- WhatsApp checkout ---------- */
function checkoutWhatsApp() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  let message = "Hello The Lace Lab, I would like to order:\n\n";
  let total = 0;

  cart.forEach((item, i) => {
    total += Number(item.price);
    message += `${i + 1}. ${item.name} - ${formatZAR(item.price)} (Size ${item.size})\n`;
  });

  message += `\nTotal: ${formatZAR(total)}`;

  // ✅ WhatsApp needs country code (South Africa) + no leading 0
  const phone = "27817644450";

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
