const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getProducts, getProductDetail, toggleFavorite, createReview, getUserFavorites, removeFavorite } = require('../controllers/productController');
const { auth, optionalAuth } = require('../middleware/auth');
const delay = require('../middleware/delay');
const { checkAdmin } = require('../middleware/role');
const validate = require('../middleware/validate');
const { registerRules, loginRules } = require('../middleware/validatorRules');

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
    return res.status(200).json({
        message: "Job IT API v1.0",
        endpoints: {
            auth: {
                "POST /register": "Create new user account (public)",
                "POST /login": "User login (public)", 
                "GET /account": "Get current user info (auth required)",
                "GET /user": "Get all users (admin only)"
            },
            products: {
                "GET /products": "List products with search & pagination (public)",
                "GET /product/:id": "Product detail with similar & reviews (public)"
            },
            favorites: {
                "GET /favorites": "Get user's favorite products (auth required)",
                "POST /favorite": "Toggle product favorite (auth required)",
                "DELETE /favorite/:productId": "Remove from favorites (auth required)"
            },
            reviews: {
                "POST /review": "Create product review (auth required)"
            }
        }
    })
});

// === PUBLIC ROUTES (No Authentication Required) ===
// Auth - Public
routerAPI.post("/register", registerRules, validate, createUser);
routerAPI.post("/login", loginRules, validate, handleLogin);

// Products - Public with optional auth (get favorite status if logged in)
routerAPI.get("/products", optionalAuth, getProducts);
routerAPI.get("/product/:id", optionalAuth, getProductDetail);

// === PROTECTED ROUTES (Authentication Required) ===
routerAPI.use(auth); // Apply auth middleware to all routes below

// Auth - Protected  
routerAPI.get("/account", delay, getAccount);
routerAPI.get("/user", checkAdmin, getUser);

// Favorites - Protected (user must be logged in)
routerAPI.get("/favorites", getUserFavorites);
routerAPI.post("/favorite", toggleFavorite);
routerAPI.delete("/favorite/:productId", removeFavorite);

// Reviews - Protected (user must be logged in)
routerAPI.post("/review", createReview);

module.exports = routerAPI;