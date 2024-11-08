// Elements for mobile menu
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
const navIcon = document.querySelector(".md\\:hidden"); // Mobile nav icon
const mobileProducts = document.getElementById("mobile-products");
const mobileCatsMenu = document.getElementById("mobile-cats-menu");

const root = document.getElementById("root");
let productsRoot;
let currentProductCount = 4; // Initialize current product count for "Load More" functionality

// Cart data initialization
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update cart counter
function updateCartCounter() {
  const cartCounter = document.getElementById('cart-counter');
  cartCounter.textContent = cart.length;
}

// Function to add product to cart
function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
}

// Function to remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
  renderCartPage(); // Re-render the cart page after deletion
}

// Function to handle "Add to Cart" button click
function handleAddToCartClick(productId) {
  getSingleProduct(productId).then((product) => {
    const productData = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price
    };
    addToCart(productData);
  });
}

// Function to attach "Add to Cart" buttons
function attachAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const productId = button.getAttribute('data-product-id');
      handleAddToCartClick(productId);
    });
  });
}

document.getElementById('cart-button').addEventListener('click', handleCartClick);

function handleCartClick(event) {
  event.preventDefault(); // Prevent the default link behavior
  history.pushState({}, "", "/cart"); // Update the URL to /cart
  checkState(); // Check the state and render the Cart page
}

// Function to render the cart page
function renderCartPage() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTemplate = cartItems
    .map((item) => {
      return `
        <div class="shadow-[0px_4px_10px_4px_#00000024] w-full rounded-md p-2 overflow-hidden flex items-center justify-between">
          <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-md">
          <div class="flex-1 ml-4">
            <h4 class="text-lg font-semibold">${item.title}</h4>
            <p class="text-sm">${item.price} Toman</p>
          </div>
          <button class="remove-from-cart-btn text-red-500" data-product-id="${item.id}">
            Remove
          </button>
        </div>
      `;
    })
    .join('');

  root.innerHTML = `
    <div class="w-11/12 mx-auto pt-12">
      <h2 class="text-2xl mb-4">Your Cart</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        ${cartItems.length ? cartTemplate : '<p>Your cart is empty.</p>'}
      </div>
      <button id="continue-shopping-btn" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
        Continue Shopping
      </button>
    </div>
  `;

  attachRemoveFromCartButtons(); // Attach event listeners for remove buttons


   // Add event listener to "Continue Shopping" button
   document.getElementById('continue-shopping-btn').addEventListener('click', () => {
    history.pushState({}, "", "/products"); // Update the URL to /products
    checkState(); // Check the state and render the main product page
  
  });
}


// Function to attach "Remove from Cart" buttons
function attachRemoveFromCartButtons() {
  const buttons = document.querySelectorAll('.remove-from-cart-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = parseInt(button.getAttribute('data-product-id'));
      removeFromCart(productId);
    });
  });
}

// Mobile menu functionality
navIcon.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
});

closeMenu.addEventListener("click", () => {
  mobileMenu.classList.add("hidden");
});

// Toggle categories menu in mobile view
mobileProducts.addEventListener("click", async () => {
  if (mobileCatsMenu.classList.contains("hidden")) {
    const cats = await fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json());

    const categoriesTemplate = cats
      .map((item) => `<li><a href="/categories/${item}" onclick="handleAClick(event)">${item}</a></li>`)
      .join("");

    mobileCatsMenu.innerHTML = categoriesTemplate;
    mobileCatsMenu.classList.remove("hidden");
  } else {
    mobileCatsMenu.classList.add("hidden");
  }
});

// Render Menu Categories for Desktop
async function renderMenuCategories() {
  const cats = await fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json());

  const temp = cats
    .map((item) => {
      return `
        <li class="pt-2">
          <a href="/categories/${item}" onclick="handleAClick(event)">
            ${item}
          </a>
        </li>
      `;
    })
    .join("");

  const catsMenu = document.getElementById("cats-menu");
  catsMenu.innerHTML = temp;
}

renderMenuCategories();

// Fetch Products By Filter (Limit)
async function getAllProductsByFilter(limit = "") {
  const result = await fetch(
    `https://fakestoreapi.com/products${limit ? `?limit=${limit}` : ""}`
  ).then((res) => res.json());
  return result;
}

// Load More Products (increase count and update URL)
async function loadMoreProducts() {
  currentProductCount += 4;
  history.pushState({}, "", "/products");
  const moreProducts = await getAllProductsByFilter(currentProductCount);
  renderProducts(moreProducts);
  checkState();
}

// Render Products on Main Page
function renderProducts(list) {
  const template = list
    .map((product) => {
      return `
        <div
          onclick="handleProductClick(${product.id})"
          class="shadow-[0px_4px_10px_4px_#00000024] w-full rounded-md p-2 overflow-hidden cursor-pointer"
        >
          <img
            src="${product.image}"
            class="w-full aspect-square object-cover"
            alt="${product.title}"
          />
          <div class="flex flex-col items-center gap-4 py-4">
            <h4>${product.title}</h4>
            <div>
              <span>${product.price}</span>
              <span>Toman</span>
              <div class="mt-4">
                <button class="add-to-cart-btn px-3 py-2 border border-black hover:bg-black hover:text-white duration-200 rounded-md" data-product-id="${product.id}">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  productsRoot.innerHTML = template;
  attachAddToCartButtons(); // Attach "Add to Cart" buttons
}

// Handle Product Click (Navigate to Product Detail Page)
function handleProductClick(productId) {
  history.pushState({}, "", `/products/${productId}`);
  checkState();
}

// Render Main Page (Initial Layout)
async function renderMainPage() {
  const mainTemplate = `
    <div class="mt-10 w-11/12 mx-auto rounded-lg overflow-hidden max-w-screen-xl">
      <img class="w-full" src="./images/intro.jpeg" width="500px" alt="" />
    </div>

    <section class="my-8 md:mt-12">
      <h2 class="text-center text-2xl">Products</h2>
      <div class="my-12 w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="products-root"></div>
      <button id="load-more-btn" onclick="loadMoreProducts()" class="w-max px-8 py-2 bg-slate-600 rounded-md !block mx-auto bg-mft-500 text-white">
        Load More
      </button>
    </section>
  `;
  root.innerHTML = mainTemplate;
  productsRoot = document.getElementById("products-root");
  const initialProducts = await getAllProductsByFilter(4);
  renderProducts(initialProducts);
}

// Render All Products on /products URL
async function renderAllProducts() {
  const allProducts = await getAllProductsByFilter();
  renderProducts(allProducts);
}

// Handle A Click (Prevent Default, Handle Navigation)
function handleAClick(event) {
  event.preventDefault();
  const href = event.target.getAttribute("href");
  history.pushState({}, "", href);
  checkState();
}

// Fetch Single Product by ID
async function getSingleProduct(id) {
  const result = await fetch(`https://fakestoreapi.com/products/${id}`).then((res) => res.json());
  return result;
}

// Render Single Product Page
function renderSingleProduct(product) {
  const { id, title, image, price, description } = product;
  const template = `
    <div class="flex flex-col md:flex-row gap-8 w-11/12 mx-auto my-8">
      <div class="w-full md:w-1/2">
        <img src="${image}" class="w-full object-cover" alt="${title}" />
      </div>
      <div class="w-full md:w-1/2">
        <h1 class="text-2xl font-bold mb-4">${title}</h1>
        <div class="text-lg mb-4">
          ${price} Toman
        </div>
        <button class="px-3 py-2 border border-black hover:bg-black hover:text-white duration-200 rounded-md mt-4 add-to-cart-btn" data-product-id="${id}">
          Add to Cart
        </button>
        <p class="mt-8 text-justify text-sm md:text-base leading-6 md:leading-8">${description}</p>
      </div>
    </div>
  `;
  root.innerHTML = template;
  attachAddToCartButtons(); // Attach "Add to Cart" button
}

// Fetch Single Category Products
async function getSingleCategory(categoryName) {
  const result = await fetch(`https://fakestoreapi.com/products/category/${categoryName}`)
    .then((res) => res.json());
  return result;
}

// Render Single Category Products
function renderSingleCategory(productsList) {
  const template = productsList
    .map((product) => {
      return `
        <div onclick="handleProductClick(${product.id})" class="shadow-[0px_4px_10px_4px_#00000024] w-full rounded-md p-2 overflow-hidden cursor-pointer">
          <img src="${product.image}" class="w-full aspect-square object-cover" alt="${product.title}" />
          <div class="flex flex-col items-center gap-4 py-4">
            <h4>${product.title}</h4>
            <div>
              <span>${product.price}</span>
              <span>Toman</span>
              <div class="mt-4">
                <button class="add-to-cart-btn px-3 py-2 border border-black hover:bg-black hover:text-white duration-200 rounded-md" data-product-id="${product.id}">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  root.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      ${template}
    </div>
  `;
  attachAddToCartButtons(); // Attach "Add to Cart" buttons
}

// Function to Check Page State and Render Accordingly
async function checkState() {
  const pathName = location.pathname;

  switch (true) {
    case pathName === "/products":
      renderMainPage();  // Ensure this line calls the main product page rendering function
      break;
    case pathName === "/":
      renderMainPage();  // Show the main page on the home path
      break;
    case pathName.includes("/categories/"):
      let cat = pathName.split("/").pop();
      const catProducts = await getSingleCategory(cat);
      renderSingleCategory(catProducts);
      break;
    case pathName.includes("/products/"):
      let pId = pathName.split("/").pop();
      const singlePData = await getSingleProduct(pId);
      renderSingleProduct(singlePData);
      break;
    case pathName === "/cart":
      renderCartPage();  // Render the Cart page
      break;
    default:
      renderMainPage();  // Default to main page if the path is unknown
      break;
  }
}

// Attach "Add to Cart" buttons on initial load
window.addEventListener('load', () => {
  attachAddToCartButtons();
  checkState(); // Check the state on load and render accordingly
});

// Update cart counter on page load
updateCartCounter();
