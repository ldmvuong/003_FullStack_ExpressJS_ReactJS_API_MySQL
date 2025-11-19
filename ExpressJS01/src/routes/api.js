const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getProducts } = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { checkAdmin } = require('../middleware/role');

const validate = require('../middleware/validate');
const { registerRules, loginRules } = require('../middleware/validatorRules');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})


routerAPI.post("/register", registerRules, validate, createUser);
routerAPI.post("/login", loginRules, validate, handleLogin);

// Thứ tự: Auth (giải mã token) -> CheckAdmin (kiểm tra role) -> Controller
routerAPI.get("/user", checkAdmin, getUser);
routerAPI.get("/account", delay, getAccount);

routerAPI.get("/products", getProducts);

module.exports = routerAPI;