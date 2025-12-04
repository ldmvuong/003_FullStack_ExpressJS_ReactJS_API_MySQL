const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { checkAdmin } = require('../middleware/role');
const delay = require('../middleware/delay');
const validate = require('../middleware/validate');
const { registerRules, loginRules } = require('../middleware/validatorRules');

const authRouter = express.Router();

// Public routes (no auth required)
authRouter.post("/register", registerRules, validate, createUser);
authRouter.post("/login", loginRules, validate, handleLogin);

// Protected routes (auth required - added by parent router)
authRouter.get("/account", delay, getAccount);

// Admin only routes
authRouter.get("/user", checkAdmin, getUser);

module.exports = authRouter;