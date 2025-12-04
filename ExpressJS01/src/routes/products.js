const express = require('express');
const { getProducts, getProductDetail } = require('../controllers/productController');

const productRouter = express.Router();

// Public routes - no authentication required
productRouter.get("/", getProducts); // GET /products - list + search + pagination
productRouter.get("/:id", getProductDetail); // GET /product/:id - detail + similar + reviews + isFavorite

module.exports = productRouter;