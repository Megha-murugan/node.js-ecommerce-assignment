// Shared in-memory "database" of products
const products = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 799, stock: 25, description: "Ergonomic wireless mouse with USB receiver." },
  { id: 2, name: "Mechanical Keyboard", category: "Electronics", price: 3499, stock: 12, description: "RGB backlit mechanical keyboard, blue switches." },
  { id: 3, name: "Bluetooth Headphones", category: "Electronics", price: 2199, stock: 0, description: "Over-ear headphones with 30-hour battery life." },
  { id: 4, name: "Men's Casual Shirt", category: "Clothing", price: 999, stock: 40, description: "100% cotton slim-fit casual shirt." },
  { id: 5, name: "Women's Denim Jacket", category: "Clothing", price: 1799, stock: 15, description: "Classic blue denim jacket, unisex fit." },
  { id: 6, name: "Running Shoes", category: "Clothing", price: 2499, stock: 8, description: "Lightweight running shoes with cushioned sole." },
  { id: 7, name: "Node.js Programming Guide", category: "Books", price: 549, stock: 30, description: "A beginner-to-advanced guide to Node.js." },
  { id: 8, name: "Clean Code", category: "Books", price: 699, stock: 0, description: "A handbook of agile software craftsmanship." },
  { id: 9, name: "Non-stick Cookware Set", category: "Home", price: 2999, stock: 10, description: "5-piece non-stick cookware set for daily cooking." },
  { id: 10, name: "LED Table Lamp", category: "Home", price: 899, stock: 22, description: "Adjustable brightness LED lamp with USB charging." }
];

function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find(p => p.id === Number(id));
}

function getProductsByCategory(name) {
  return products.filter(p => p.category.toLowerCase() === String(name).toLowerCase());
}

function getAllCategories() {
  return [...new Set(products.map(p => p.category))];
}

module.exports = { getAllProducts, getProductById, getProductsByCategory, getAllCategories };
