const express = require('express');
const { toggleFavorite, getUserFavorites, removeFavorite } = require('../controllers/productController');

const favoriteRouter = express.Router();

// All favorite routes require authentication (handled by parent router)
favoriteRouter.get("/", getUserFavorites); // GET /favorites - list user's favorite products
favoriteRouter.post("/", toggleFavorite); // POST /favorite - add/remove favorite (toggle)
favoriteRouter.delete("/:productId", removeFavorite); // DELETE /favorite/:productId - remove specific favorite

module.exports = favoriteRouter;