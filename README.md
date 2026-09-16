```##⚠️ T.24.56 ``` 
# Node.js Assignment — E-Commerce Product Management
### Case Study 2, developed as two separate implementations

``` 
Case Study 2: E-Commerce Product Management

Develop an application for an e-commerce company to manage and display products.

Implement suitable routes such as:

- "/" – Home
- "/products" – Display all products
- "/products/:id" – Display details of a selected product
- "/category/:name" – Display products belonging to a category

Use dynamic routing and the Handlebars "{{#each}}" helper to display multiple products in the Express implementation.
```

```
ecommerce-assignment/
├── http-implementation/       Implementation A — core "http" module
│   ├── server.js
│   └── data.js
└── express-implementation/    Implementation B — Express.js + Handlebars (HBS)
    ├── app.js
    ├── data.js
    ├── package.json
    ├── views/
    │   ├── index.hbs, products.hbs, product-detail.hbs, category.hbs, error.hbs
    │   └── partials/ (header.hbs, footer.hbs)
    └── public/style.css
```

## Routes implemented (both apps)

| Route | Description |
|---|---|
| `GET /` | Home — lists categories |
| `GET /products` | All products (static route, `{{#each}}` loop in Express) |
| `GET /products/:id` | Product detail (dynamic route parameter) |
| `GET /category/:name` | Products filtered by category (dynamic route parameter) |

Status codes used: `200` success, `400` invalid id format, `404` product/category/route not found, `405` wrong HTTP method (HTTP-module app), `500` server error.

## How to run

### Implementation A — HTTP module
```bash
cd http-implementation
node server.js
```
Visit **http://localhost:3000**

### Implementation B — Express + Handlebars
```bash
cd express-implementation
npm install
npm start
```
Visit **http://localhost:3001**

---

## Comparison: HTTP module vs Express.js

| Aspect | Node.js `http` module | Express.js |
|---|---|---|
| **Routing** | Manual — parse `req.url`, split into segments, use `if`/regex checks to match paths and extract params (e.g. `segments[1]` for `:id`). No native concept of route parameters. | Declarative — `app.get('/products/:id', ...)` with automatic parameter extraction into `req.params`. Supports route chaining, routers, and middleware. |
| **Code complexity** | Higher for the same functionality — every route, method check, and 404/405 case must be hand-coded. HTML is built with manual string concatenation. | Lower — routing, static file serving, and view rendering are handled by the framework. `res.render()` + Handlebars separates HTML from logic. |
| **Maintainability** | Harder to extend. Adding a new route means editing a single large `if/else` chain; markup and logic are mixed in template literals, so growth quickly becomes unwieldy. | Easier. Routes are isolated and can be split into separate router files; views live in `.hbs` files (separation of concerns), so designers/developers can work independently and reused partials (header/footer) avoid duplication. |
| **Scalability** | Fine for tiny apps, but scaling to many routes/features (auth, sessions, file uploads, JSON APIs, validation) requires reimplementing what Express already provides. | Scales well — huge middleware ecosystem (body-parser, cors, auth libraries, etc.), well-suited for larger applications and REST APIs. |
| **Learning value** | Excellent for understanding what actually happens "under the hood" (raw sockets, headers, status codes). | Better for real-world productivity once fundamentals are understood. |

**Conclusion:** the `http` module is valuable for understanding core request/response mechanics, but Express.js (paired with a template engine like Handlebars) is the more practical, maintainable, and scalable choice for real applications with multiple views and growing route counts.
