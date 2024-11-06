// DOM NODES
const mobileMenu = document.getElementById("mobile-menu");
let productsRoot;
const root = document.getElementById("root");

async function renderMenuCategories() {
  const cats = await fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((json) => json);

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


async function getAllProductsByFilter(limit = "") {
  const result = await fetch(
    `https://fakestoreapi.com/products${limit ? `?limit=${limit}` : ""}`
  )
    .then((res) => res.json())
    .then((json) => {
      return json;
    });

  return result;
}

function renderProducts(list) {
  const template = list
    .map((product) => {
      return `
        <div
          onclick="handleProductClick(${product.id})"
          class="shadow-[0px_4px_10px_4px_#00000024] w-full rounded-md overflow-hidden"
        >
          <img
            src="${product.image}"
            class="w-full aspect-square object-cover"
            alt=""
          />
          <!-- description -->
          <div class="flex flex-col items-center gap-4 py-4">
            <h4>${product.title}</h4>
            <div>
              <span>${product.price}</span>
              <span>تومان</span>
            </div>
          </div>
        </div>
      </div>
        `;
    })
    .join("");

  productsRoot.innerHTML = template;
}

function handleProductClick(productId) {
  history.pushState({}, "", `/products/${productId}`);
  checkState();
}

async function renderAllProducts() {
  const data = await getAllProductsByFilter();

  renderProducts(data);
}

async function renderMainPage() {
  const mainTemplate = `
    <div
        class="mt-10 w-11/12 mx-auto rounded-lg overflow-hidden max-w-screen-xl"
      >
        <img class="w-full" src="./images/intro.jpeg" width="500px" alt="" />
      </div>

      <section class="my-8 md:mt-12">
        <h2 class="text-center text-2xl">محصولات</h2>

        <div
          class="my-12 md:my-16 w-11/12 md:w-full md:max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          id="products-root"
        ></div>

        <a
          href="/products"
          onclick="handleAClick(event)"
          class="w-max px-8 py-2 rounded-md !block mx-auto bg-mft-500 text-white"
        >
          مشاهده بیشتر
        </a>
      </section>
    `;

  root.innerHTML = mainTemplate;
  productsRoot = document.getElementById("products-root");

  const limitedProducts = await getAllProductsByFilter("4");

  renderProducts(limitedProducts);
}

renderMainPage();

function handleAClick(event) {
  event.preventDefault();
  const href = event.target.getAttribute("href");
  history.pushState({}, "", href);
  checkState();
}

function toggleMobileMenu(action) {
  if (action === "open") {
    mobileMenu.classList.remove("scale-x-0");
  } else if (action === "close") {
    mobileMenu.classList.add("scale-x-0");
  }
}

async function getSingleProduct(productId) {
  const result = await fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((res) => res.json())
    .then((json) => json);

  return result;
}

function renderSingleProduct({
  category: cat,
  description: desc,
  image,
  price,
  title,
}) {
  // const { category, description, image, price, title } = productData;

  const template = `
  <div
  class="w-11/12 mx-auto pt-16 flex flex-col gap-2 md:gap-4 md:max-w-[1280px] md:flex-row md:items-start"
>
  <img
    src="${image}"
    class="rounded-md w-1/2 max-w-md hidden md:block"
    alt=""
  />
  <div class="order-1 w-full">
    <span class="text-white bg-black rounded-full px-4 py-1"
      >${cat}</span
    >
    <div class="mt-4">
      <a href="/src/index.html">صفحه اصلی</a>
      /
      <a onclick="handleAClick(event)" href="/products">همه محصولات</a>
    </div>
    <h1 class="text-slate-700 mt-4 text-2xl font-bold">
      ${title}
    </h1>

    <img
      src="${image}"
      class="rounded-md w-full md:hidden block my-4"
      alt=""
    />

    <div class="block text-center md:mt-4 md:text-start font-extrabold">
      <span>${price}</span>
      تومان
    </div>

    <button
      class="w-full md:w-auto px-4 py-2 my-5 bg-green-400 text-white rounded-md text-center"
    >
      اضافه به سبد خرید
    </button>

    <p>
      ${desc}
    </p>
  </div>
</div>
  `;

  root.innerHTML = template;
}

async function getSingleCategory(cat) {
  const result = await fetch(
    `https://fakestoreapi.com/products/category/${cat}`
  )
    .then((res) => res.json())
    .then((json) => json);

  return result;
}

function renderSingleCategory(list) {
  debugger;
  const template = list
    .map((product) => {
      return `
        <div
          onclick="handleProductClick(${product.id})"
          class="shadow-[0px_4px_10px_4px_#00000024] w-full rounded-md overflow-hidden"
        >
          <img
            src="${product.image}"
            class="w-full aspect-square object-cover"
            alt=""
          />
          <!-- description -->
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

  const result = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
        ${template}
      </div>
    `;

  root.innerHTML = result;
}

async function checkState() {
  const pathName = location.pathname;
  // if (pathName === "/all-products") {
  //   renderAllProducts();
  // } else if (pathName === "/src/index.html") {
  //   renderMainPage();
  // } else if(path)

  switch (true) {
    case pathName === "/products":
      renderAllProducts();
      break;
    case pathName === "/src/index.html":
      renderMainPage();
      break;
    case pathName.includes("/categories/"):
      let cat = pathName.split("/");
      cat = cat[cat.length - 1];
      const catProducts = await getSingleCategory(cat);
      renderSingleCategory(catProducts);
      break;
    case pathName.includes("/products/"):
      let pId = pathName.split("/");
      pId = pId[pId.length - 1];
      const singlePData = await getSingleProduct(pId);
      renderSingleProduct(singlePData);
      break;
    default:
      renderMainPage();
      break;
  }
}

window.addEventListener("popstate", checkState);
