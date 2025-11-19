const { getProductListService } = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        let { page, limit } = req.query;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;

        const data = await getProductListService(page, limit);

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching products" });
    }
}

module.exports = { getProducts };