/**
 * IMPLEMENTATION B - Express.js + Handlebars (HBS)
 * Case Study: E-Commerce Product Management
 *
 * Run:
 *   npm install
 *   npm start
 * Then visit http://localhost:3001
 */

const express = require("express");
const path = require("path");
const hbs = require("hbs");
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories
} = require("./data");

const app = express();
const PORT = 3001;

//  View engine setup 
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// Static assets (CSS)
app.use(express.static(path.join(__dirname, "public")));

//  Handlebars helpers 
// Conditional helper: compare two values, e.g. {{#if (eq category "Books")}}
hbs.registerHelper("eq", (a, b) => a === b);

// Helper to format price with currency symbol
hbs.registerHelper("currency", (value) => `₹${value}`);

//  Routes 

// Static route: Home
app.get("/", (req, res) => {
  const categories = getAllCategories();
  res.status(200).render("index", {
    title: "Home",
    categories
  });
});

// Static route: all products
app.get("/products", (req, res) => {
  const products = getAllProducts();
  res.status(200).render("products", {
    title: "All Products",
    products,
    count: products.length
  });
});

// Dynamic route with route parameter: product details
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).render("error", {
      title: "Bad Request",
      code: 400,
      message: "Product id must be numeric."
    });
  }

  const product = getProductById(id);

  if (!product) {
    return res.status(404).render("error", {
      title: "Not Found",
      code: 404,
      message: `No product exists with id ${id}.`
    });
  }

  res.status(200).render("product-detail", {
    title: product.name,
    product
  });
});

// Dynamic route with route parameter: products by category
app.get("/category/:name", (req, res) => {
  const { name } = req.params;
  const products = getProductsByCategory(name);

  if (products.length === 0) {
    return res.status(404).render("error", {
      title: "Not Found",
      code: 404,
      message: `No products found in category "${name}".`
    });
  }

  res.status(200).render("category", {
    title: `Category: ${name}`,
    categoryName: name,
    products
  });
});

// Catch-all 404 for unmatched routes
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    code: 404,
    message: `The route "${req.originalUrl}" does not exist.`
  });
});

// Generic error handler (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Server Error",
    code: 500,
    message: "Something went wrong on the server."
  });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
