const { getProductListService, getProductDetailService, toggleFavoriteService, createReviewService, getUserFavoritesService, removeFavoriteService } = require('../services/productService');
const { User } = require('../models/index');

const getProducts = async (req, res) => {
  try {
    console.log("=== getProducts Controller ===");
    console.log("Query params:", req.query);
    console.log("User from token:", req.user);

    // Try to get user id from token email if authenticated
    let userId = null;
    if (req.user && req.user.email) {
      const user = await User.findOne({ where: { email: req.user.email } });
      if (user) userId = user.id;
    }

    console.log("Resolved userId:", userId);

    const data = await getProductListService(req.query, userId);
    
    console.log("Service returned:", data ? "Data received" : "NULL received");

    if (data === null) {
      return res.status(500).json({ message: "Error fetching products from service" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const id = req.params.id;
    // Try to get user id from token email
    let userId = null;
    if (req.user && req.user.email) {
      const user = await User.findOne({ where: { email: req.user.email } });
      if (user) userId = user.id;
    }

    const data = await getProductDetailService(id, userId);
    if (!data) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching product detail' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Missing productId' });

    if (!req.user || !req.user.email) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const result = await toggleFavoriteService({ productId, userId: user.id });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error toggling favorite' });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId) return res.status(400).json({ message: 'Missing productId' });

    if (!req.user || !req.user.email) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newReview = await createReviewService({ productId, userId: user.id, rating, comment });
    return res.status(200).json(newReview);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error creating review' });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    if (!req.user || !req.user.email) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const favorites = await getUserFavoritesService(user.id);
    return res.status(200).json({ favorites: favorites || [] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching favorites' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ message: 'Missing productId' });

    if (!req.user || !req.user.email) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const result = await removeFavoriteService({ productId, userId: user.id });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error removing favorite' });
  }
};

module.exports = { getProducts, getProductDetail, toggleFavorite, createReview, getUserFavorites, removeFavorite };