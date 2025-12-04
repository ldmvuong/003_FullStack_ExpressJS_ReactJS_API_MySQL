const { Product, Category } = require('../models/index');
const { Favorite, Review, User } = require('../models/index');
const { Op } = require('sequelize');

const getProductListService = async (queryString, userId = null) => {
    try {
        const { 
            page, limit, 
            keyword, 
            priceMin, priceMax, 
            category, // VD: "Apple,Samsung" hoặc "Apple"
            ram,      // VD: "8GB,12GB" hoặc "8GB"
            rom, 
            sort 
        } = queryString;

        const _page = page ? parseInt(page) : 1;
        const _limit = limit ? parseInt(limit) : 10;
        const offset = (_page - 1) * _limit;

        const buildFilter = (param) => {
            if (!param) return undefined;
            
            // 1. Nếu là mảng (Frontend gửi dạng ?ram=8GB&ram=12GB)
            if (Array.isArray(param)) return { [Op.in]: param };
            
            // 2. Nếu là chuỗi có dấu phẩy (Frontend gửi dạng ?ram=8GB,12GB)
            if (param.includes(',')) return { [Op.in]: param.split(',') };
            
            // 3. Nếu là chuỗi đơn (Frontend gửi dạng ?ram=8GB) -> QUAN TRỌNG: Bọc vào mảng
            return { [Op.in]: [param] };
        }

        // --- XÂY DỰNG BỘ LỌC (WHERE) ---
        let whereClause = {};

        // 1. Tìm theo tên
        if (keyword) whereClause.name = { [Op.like]: `%${keyword}%` };

        // 2. Lọc theo giá
        if (priceMin || priceMax) {
            whereClause.price = {};
            if (priceMin) whereClause.price[Op.gte] = parseInt(priceMin);
            if (priceMax) whereClause.price[Op.lte] = parseInt(priceMax);
        }

        // 3. Lọc theo Cấu hình (RAM, ROM)
        if (ram) whereClause.ram = buildFilter(ram);
        if (rom) whereClause.rom = buildFilter(rom);

        // 4. Lọc theo Danh mục  
        let includeClause = [{ 
            model: Category, 
            attributes: ['id', 'name'],
            where: {} 
        }];
        
        if (category) {
            includeClause[0].where.name = buildFilter(category);
            
        } else {
            // Xóa điều kiện where nếu không lọc category để tránh lỗi query
            delete includeClause[0].where;
        }

        // --- SẮP XẾP ---
        let orderClause = [['createdAt', 'DESC']];
        if (sort) {
            if (sort === 'price-asc') orderClause = [['price', 'ASC']];
            if (sort === 'price-desc') orderClause = [['price', 'DESC']];
            if (sort === 'sold-desc') orderClause = [['sold', 'DESC']];
        }

        // --- THỰC THI ---
        console.log("Query conditions:", {
            whereClause,
            includeClause,
            userId
        });

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            include: includeClause, // JOIN bảng Category
            offset: offset,
            limit: _limit,
            order: orderClause
        });

        console.log("Query results:", { count, rowsLength: rows.length });

        // Transform products to include isFavorite status
        const products = rows.map(product => {
            const productData = product.toJSON();
            
            // For now, set isFavorite to false for all products
            // TODO: Re-implement favorite checking after fixing the association issue
            productData.isFavorite = false;
            
            return productData;
        });

        const result = {
            totalRows: count,
            totalPages: Math.ceil(count / _limit),
            currentPage: _page,
            products: products
        };
        
        console.log("Service returning:", result);
        return result;
    } catch (error) {
        console.error("ProductService Error:", error);
        return null;
    }
}

module.exports = { getProductListService };

const getProductDetailService = async (productId, userId = null) => {
    try {
        const product = await Product.findByPk(productId, {
            include: [{ model: Category, attributes: ['id', 'name'] }, {
                model: Review,
                include: [{ model: User, attributes: ['id', 'name'] }],
                order: [['createdAt', 'DESC']]
            }]
        });

        if (!product) return null;

        // Get similar products (same CategoryId, exclude current)
        const similar = await Product.findAll({
            where: {
                CategoryId: product.CategoryId,
                id: { [Op.ne]: product.id }
            },
            limit: 6
        });

        // Count reviews
        const reviewsCount = await Review.count({ where: { ProductId: productId } });

        // Is favorite for user?
        let isFavorite = false;
        if (userId) {
            const fav = await Favorite.findOne({ where: { UserId: userId, ProductId: productId } });
            isFavorite = !!fav;
        }

        return {
            product,
            similarProducts: similar,
            reviewsCount,
            reviews: product.Reviews || [],
            isFavorite,
            sold: product.sold || 0
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const toggleFavoriteService = async ({ productId, userId }) => {
    try {
        if (!userId) throw new Error('Missing userId');

        const existing = await Favorite.findOne({ where: { UserId: userId, ProductId: productId } });
        
        if (existing) {
            await existing.destroy();
            return { liked: false };
        } else {
            await Favorite.create({ UserId: userId, ProductId: productId });
            return { liked: true };
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const createReviewService = async ({ productId, userId, rating, comment }) => {
    try {
        if (!userId) throw new Error('Missing userId');
        if (!productId) throw new Error('Missing productId');

        const newReview = await Review.create({ rating, comment, UserId: userId, ProductId: productId });
        return newReview;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getUserFavoritesService = async (userId) => {
    try {
        const favoriteRecords = await Favorite.findAll({
            where: { UserId: userId },
            include: [{
                model: Product,
                include: [{ model: Category, attributes: ['id', 'name'] }]
            }],
            order: [['createdAt', 'DESC']]
        });
        
        if (favoriteRecords.length === 0) {
            return [];
        }
        
        // Extract products from favorite records
        const products = favoriteRecords
            .filter(fav => fav.Product) // Filter out null products
            .map(fav => fav.Product);
        
        return products;
        
    } catch (error) {
        console.log(error);
        return [];
    }
};

const removeFavoriteService = async ({ productId, userId }) => {
    try {
        if (!userId) throw new Error('Missing userId');
        
        const favorite = await Favorite.findOne({ where: { UserId: userId, ProductId: productId } });
        if (!favorite) throw new Error('Favorite not found');
        
        await favorite.destroy();
        return { success: true };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = { 
    getProductListService, 
    getProductDetailService, 
    toggleFavoriteService, 
    createReviewService,
    getUserFavoritesService,
    removeFavoriteService
};