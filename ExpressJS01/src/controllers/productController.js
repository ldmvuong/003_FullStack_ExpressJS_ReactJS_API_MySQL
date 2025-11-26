const { getProductListService } = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const data = await getProductListService(req.query);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching products" });
  }
};

module.exports = { getProducts };