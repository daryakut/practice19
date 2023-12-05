function renderProduct(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("productCard");

  productCard.addEventListener("click", (event) => {
    productCard.classList.toggle("productCardHighlighted");
  });

  const productTitle = document.createElement("h3");
  productTitle.textContent = product.name;
  productTitle.classList.add("productTitle");

  const productPrice = document.createElement("p");
  productPrice.textContent = product.price;
  productPrice.classList.add("productPrice");

  const productCategory = document.createElement("p");
  productCategory.textContent = product.category;
  productCategory.classList.add("productCategory");

  const productImg = document.createElement("img");
  productImg.src = !!product.img ? product.img : "";
  productImg.classList.add("productImg");

  const productDescription = document.createElement("p");
  productDescription.textContent = product.description;
  productDescription.classList.add("productDescription");

  productCard.append(
    productImg,
    productTitle,
    productPrice,
    productCategory,
    productDescription
  );

  return productCard;
}

const productsContainer = document.querySelector(".productsContainer");
const categoriesSelect = document.createElement("select");
const mainContainer = document.querySelector("main");
mainContainer.prepend(categoriesSelect);

function renderCategories(categories) {
  categories.forEach((category) => {
    const optionEl = document.createElement("option");
    optionEl.value = category;
    optionEl.textContent = category;
    categoriesSelect.append(optionEl);
  });
}

function renderProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    productsContainer.append(renderProduct(product));
  });
}

// function getProducts(category) {
//     return new Promise((resolve, reject) => {
//         const url = `https://fakestoreapi.com/products${category ? '/category/' + category : ''}`
//         fetch(url)
//             .then(response => {
//                 return response.json()
//             })
//             .then((result) => {
//                 resolve(result);
//             })
//             .catch(error => {
//                 reject(error);
//             });
//         });
// }

// 1.
async function fetchCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    if (!response.ok) {
      throw new Error(`Failed to fetch categories. Status: ${response.status}`);
    }
    const categories = await response.json();
    console.log(categories);
    renderCategories(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

fetchCategories();

//2, 3
async function getProducts(category = "smartphones") {
  const url = `https://dummyjson.com/products/category/${category}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    const products = await response.json();
    console.log("products!!!", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
getProducts();

//4
async function jsonRequest(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in jsonRequest:", error);
    throw error;
  }
}

//
// 5. Делаем отрисовку страницы. Нужно при загрузке скрипта:
//  - показать "иконку загрузки" - параграф с классом `loader`
//  - отправить запрос категорий `https://fakestoreapi.com/products/categories`
//  - оправить запрос товаров `https://fakestoreapi.com/products/`
//  - дождаться выполнения обоих запросов, и скрыть иконку загрузки
//  - вызвать функцию renderProducts для ответа на запрос товаров, и renderCategories для ответа на запрос категорий.

document.addEventListener("DOMContentLoaded", async function () {
  const loader = document.querySelector(".loader");
  loader.style.display = "block";

  try {
    const [categories, products] = await Promise.all([
      jsonRequest("https://dummyjson.com/products/categories"),
      jsonRequest("https://dummyjson.com/products/category/smartphones"),
    ]);

    loader.style.display = "none";
    renderProducts(products.products);
    renderCategories(categories);
  } catch (error) {
    console.error("Error during data fetching:", error);
  }
});

// 6
// 6. В скрипте есть массив категорий `categoriesArray`. Нужно отправить сетевые запросы товаров этих категорий, и вывести ПЕРВЫЙ успешно завершенный запрос. Для отправки запроса используем нашу функцию `getProducts`.
("https://dummyjson.com/products/categories");
const categoriesArray = [
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
  "furniture",
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-watches",
  "womens-bags",
  "womens-jewellery",
  "sunglasses",
  "automotive",
  "motorcycle",
  "lighting",
];

async function fetchFirstSuccessfulProduct() {
  const categoryPromises = categoriesArray.map((category) =>
    getProducts(category)
  );

  const firstSuccessfulProducts = await Promise.race(categoryPromises);
  console.log("First successful products:", firstSuccessfulProducts);
  return firstSuccessfulProducts;
}
fetchFirstSuccessfulProduct();