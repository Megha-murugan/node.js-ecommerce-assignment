/**
 * IMPLEMENTATION A - Pure Node.js "http" module
 * Case Study: E-Commerce Product Management
 *
 * No Express, no Handlebars - routing and rendering done manually.
 * Run: node server.js   -> http://localhost:3000
 */

const http = require("http");
const url = require("url");
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories
} = require("./data");

const PORT = 3000;

//  Small HTML helpers (manual "templating")

function pageWrapper(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} | ShopEasy (HTTP)</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f4f6f8; color: #222; }
    header { background: #2b2d42; color: #fff; padding: 16px 24px; }
    header a { color: #fff; text-decoration: none; margin-right: 16px; font-weight: bold; }
    nav { margin-top: 8px; }
    main { padding: 24px; max-width: 900px; margin: 0 auto; }
    .card { background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .price { color: #2b8a3e; font-weight: bold; }
    .out { color: #c92a2a; font-weight: bold; }
    a.btn { display: inline-block; margin-top: 8px; background: #2b2d42; color: #fff; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 14px; }
    .error { background: #ffe3e3; border: 1px solid #ff8787; padding: 20px; border-radius: 8px; }
    footer { text-align: center; padding: 16px; color: #888; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <h2 style="margin:0;">🛒 ShopEasy — HTTP Module Version</h2>
    <nav>
      <a href="/">Home</a>
      <a href="/products">All Products</a>
      <a href="/category/Electronics">Electronics</a>
      <a href="/category/Books">Books</a>
    </nav>
  </header>
  <main>${bodyHtml}</main>
  <footer>Built with the core Node.js "http" module (no Express).</footer>
</body>
</html>`;
}

function productCard(p) {
  return `
    <div class="card">
      <h3>${p.name}</h3>
      <p>Category: ${p.category}</p>
      <p class="price">₹${p.price}</p>
      <p>${p.stock > 0 ? `In stock (${p.stock})` : `<span class="out">Out of stock</span>`}</p>
      <a class="btn" href="/products/${p.id}">View Details</a>
    </div>`;
}

function notFoundPage(message) {
  return pageWrapper(
    "Not Found",
    `<div class="error"><h2>404 - Not Found</h2><p>${message}</p></div>`
  );
}

//  Route handlers 

function handleHome(req, res) {
  const categories = getAllCategories();
  const body = `
    <h1>Welcome to ShopEasy</h1>
    <p>A simple e-commerce catalog built using the raw Node.js HTTP module.</p>
    <h3>Browse by category:</h3>
    <ul>${categories.map(c => `<li><a href="/category/${c}">${c}</a></li>`).join("")}</ul>
    <p><a class="btn" href="/products">View All Products</a></p>
  `;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(pageWrapper("Home", body));
}

function handleAllProducts(req, res) {
  const products = getAllProducts();
  const body = `
    <h1>All Products</h1>
    ${products.map(productCard).join("")}
  `;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(pageWrapper("All Products", body));
}

function handleProductDetail(req, res, id) {
  if (!/^\d+$/.test(id)) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(pageWrapper("Bad Request", `<div class="error"><h2>400 - Bad Request</h2><p>Product id must be numeric.</p></div>`));
    return;
  }
  const product = getProductById(id);
  if (!product) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(notFoundPage(`No product exists with id ${id}.`));
    return;
  }
  const body = `
    <h1>${product.name}</h1>
    <div class="card">
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> <span class="price">₹${product.price}</span></p>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Availability:</strong> ${product.stock > 0 ? `${product.stock} units in stock` : `<span class="out">Out of stock</span>`}</p>
      <a class="btn" href="/products">&larr; Back to products</a>
    </div>
  `;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(pageWrapper(product.name, body));
}

function handleCategory(req, res, name) {
  const products = getProductsByCategory(name);
  if (products.length === 0) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(notFoundPage(`No products found in category "${name}".`));
    return;
  }
  const body = `
    <h1>Category: ${name}</h1>
    ${products.map(productCard).join("")}
  `;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(pageWrapper(`Category: ${name}`, body));
}

//  Manual router 

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/"; // strip trailing slash
  const segments = pathname.split("/").filter(Boolean); // e.g. ['products','5']

  // Only GET is supported in this simple catalog app
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/html", "Allow": "GET" });
    res.end(pageWrapper("Method Not Allowed", `<div class="error"><h2>405 - Method Not Allowed</h2><p>${req.method} is not supported on ${pathname}.</p></div>`));
    return;
  }

  try {
    if (pathname === "/") {
      return handleHome(req, res);
    }

    if (pathname === "/products") {
      return handleAllProducts(req, res);
    }

    if (segments[0] === "products" && segments.length === 2) {
      return handleProductDetail(req, res, segments[1]);
    }

    if (segments[0] === "category" && segments.length === 2) {
      return handleCategory(req, res, decodeURIComponent(segments[1]));
    }

    // No route matched
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(notFoundPage(`The route "${pathname}" does not exist.`));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(pageWrapper("Server Error", `<div class="error"><h2>500 - Internal Server Error</h2><p>${err.message}</p></div>`));
  }
});

server.listen(PORT, () => {
  console.log(`HTTP-module server running at http://localhost:${PORT}`);
});
