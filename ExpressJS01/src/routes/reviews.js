const express = require('express');
const { createReview } = require('../controllers/productController');

const reviewRouter = express.Router();

// All review routes require authentication (handled by parent router)
reviewRouter.post("/", createReview); // POST /review - create review for product

module.exports = reviewRouter;