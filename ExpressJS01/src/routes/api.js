const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const validate = require('../middleware/validate');
const { registerRules, loginRules } = require('../middleware/validatorRules');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})


routerAPI.post("/register", registerRules, validate, createUser);
routerAPI.post("/login", loginRules, validate, handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;