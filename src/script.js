// DOM NODES
const mobileMenu = document.getElementById("mobile-menu");
let productsRoot;
const root = document.getElementById("root");

let currentProductCount = 4; // Initialize current product count for load more functionality

// Render Menu Categories
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
  )
    .then((res) => res.json());
  return result;
}

// Load More Products (increase count)
async function loadMoreProducts() {
  currentProductCount += 4;  // Increase the product count
  const moreProducts = await getAllProductsByFilter(currentProductCount);  // Fetch more products based on current count
  renderProducts(moreProducts);  // Render the new products
}

// Render Products
function renderProducts(list) {
  const template = list
    .map((product) => {
      return `
        <div
          onclick="handleProductClick(${product.id})"
          class="shadow-[0px_4px_10px_4px_#00000024] w-full rounded-md p-2 overflow-hidden"
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
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  productsRoot.innerHTML = template;
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

// Handle A Click (Prevent Default, Handle Navigation)
function handleAClick(event) {
  event.preventDefault();
  const href = event.target.getAttribute("href");
  history.pushState({}, "", href);
  checkState();
}

// Toggle Mobile Menu (open/close)
function toggleMobileMenu(action) {
  if (action === "open") {
    mobileMenu.classList.remove("scale-x-0");
  } else if (action === "close") {
    mobileMenu.classList.add("scale-x-0");
  }
}

// Get Single Product Data
async function getSingleProduct(productId) {
  const result = await fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((res) => res.json());
  return result;
}

// Render Single Product (Product Details Page)
function renderSingleProduct({ category, description, image, price, title }) {
  const template = `
    <div class="w-11/12 mx-auto pt-16 flex flex-col gap-2 md:gap-4 md:max-w-[1280px] md:flex-row md:items-start">
      <img src="${image}" class="rounded-md w-1/2 max-w-md hidden md:block" alt="${title}" />
      <div class="order-1 w-full">
        <span class="text-white bg-black rounded-full px-4 py-1">${category}</span>
        <div class="mt-4">
          <a href="/" onclick="handleAClick(event)">صفحه اصلی</a> / 
          <a onclick="handleAClick(event)" href="/products">همه محصولات</a>
        </div>
        <h1 class="text-slate-700 mt-4 text-2xl font-bold">${title}</h1>
        <img src="${image}" class="rounded-md w-full md:hidden block my-4" alt="${title}" />
        <div class="block text-center md:mt-4 md:text-start font-extrabold">
          <span>${price}</span> تومان
        </div>
        <button class="w-full md:w-auto px-4 py-2 my-5 bg-green-400 text-white rounded-md">اضافه به سبد خرید</button>
        <p>${description}</p>
      </div>
    </div>
  `;
  root.innerHTML = template;
}

// Get Single Category Products
async function getSingleCategory(cat) {
  const result = await fetch(`https://fakestoreapi.com/products/category/${cat}`)
    .then((res) => res.json());
  return result;
}

// Render Single Category (Category Detail Page)
function renderSingleCategory(list) {
  const template = list
    .map((product) => {
      return `
        <div onclick="handleProductClick(${product.id})" class="shadow-[0px_4px_10px_4px_#00000024] w-full rounded-md overflow-hidden">
          <img src="${product.image}" class="w-full aspect-square object-cover" alt="${product.title}" />
          <div class="flex flex-col items-center gap-4 py-4">
            <h4>${product.title}</h4>
            <div>
              <span>${product.price}</span>
              <span>تومان</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const result = `<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">${template}</div>`;
  root.innerHTML = result;
}

// Check Current URL Path and Render Corresponding Content
async function checkState() {
  const pathName = location.pathname;

  switch (true) {
    case pathName === "/products":
      renderAllProducts();
      break;
    case pathName === "/":
      renderMainPage();
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
    default:
      renderMainPage();
      break;
  }
}

// Popstate listener to manage browser navigation
window.addEventListener("popstate", checkState);

// Start with checking the current state
checkState();
