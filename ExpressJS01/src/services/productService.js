const { Product } = require('../models/index');

const getProductListService = async (page, limit) => {
    try {
        const offset = (page - 1) * limit;
        const { count, rows } = await Product.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });

        return {
            totalRows: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            products: rows
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { getProductListService };