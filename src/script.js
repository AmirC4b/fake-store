// Elements for mobile menu
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
const navIcon = document.querySelector(".md\\:hidden"); // Mobile nav icon
const mobileProducts = document.getElementById("mobile-products");
const mobileCatsMenu = document.getElementById("mobile-cats-menu");

let productsRoot;
const root = document.getElementById("root");
let currentProductCount = 4; // Initialize current product count for load more functionality

// Function to show the mobile menu
navIcon.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
});

// Function to close the mobile menu
closeMenu.addEventListener("click", () => {
  mobileMenu.classList.add("hidden");
});

// Toggle categories menu in mobile view
mobileProducts.addEventListener("click", async () => {
  if (mobileCatsMenu.classList.contains("hidden")) {
    // If the menu is hidden, fetch and show categories
    const cats = await fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json());

    const categoriesTemplate = cats
      .map((item) => `<li><a href="/categories/${item}" onclick="handleAClick(event)">${item}</a></li>`)
      .join("");

    mobileCatsMenu.innerHTML = categoriesTemplate;
    mobileCatsMenu.classList.remove("hidden");
  } else {
    // Hide the menu if it is already shown
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
  currentProductCount += 4; // Increase the product count
  
  // Update the URL to show all products
  history.pushState({}, "", "/products");

  // Fetch all products according to current count and re-render
  const moreProducts = await getAllProductsByFilter(currentProductCount);
  renderProducts(moreProducts);

  // Check the updated state to render the appropriate content based on the URL
  checkState();
}

// Render Products
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
                <button class="px-3 py-2 border border-black hover:bg-black hover:text-white duration-200 rounded-md">
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

// New function to render all products on /products URL
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

// Get Single Product Data
async function getSingleProduct(productId) {
  const result = await fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((res) => res.json());
  return result;
}

// Render Single Product (Product Details Page)
function renderSingleProduct({ category, description, image, price, title }) {
  const template = `
    <div class="w-11/12 mx-auto pt-12 flex flex-col gap-2 md:gap-4 md:max-w-[1280px] md:flex-row md:items-start">
      <img src="${image}" class="rounded-md w-1/3 max-w-md hidden md:block" alt="${title}" />
      <div class="order-1 w-full mt-5"> 
        <div class="mt-4">
          <span class="text-white bg-black rounded-full px-4 py-1">${category}</span>
          <a href="/" onclick="handleAClick(event)">Home</a> / 
          <a onclick="handleAClick(event)" href="/products">All Products</a>
        </div>
        <h1 class="text-slate-700 mt-4 text-2xl font-bold">${title}</h1>
        <img src="${image}" class="rounded-md w-full md:hidden block my-4" alt="${title}" />
        <div class="block text-center md:mt-4 md:text-start font-extrabold">
          <span>${price}</span> Toman
        </div>
        <button class="w-full md:w-auto px-4 py-2 my-5 border-black border duration-200 rounded-md hover:bg-black hover:text-white">Add To Cart</button>
        <p class="w-[30rem] my-3 flex justify-center items-center">${description}</p>
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

// Render Single Category
function renderSingleCategory(products) {
  renderProducts(products);
}

// Check Current URL Path and Render Corresponding Content
async function checkState() {
  const pathName = location.pathname;

  switch (true) {
    case pathName === "/products":
      renderAllProducts();  // Show all products on this path
      break;
    case pathName === "/":
      renderMainPage();  // Show the main page
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
      renderMainPage();  // Default to main page if the path is unknown
      break;
  }
}

// Popstate listener to manage browser navigation
window.addEventListener("popstate", checkState);

// Start with checking the current state
checkState();
