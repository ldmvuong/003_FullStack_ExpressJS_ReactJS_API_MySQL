const { Product, Category } = require('../models/index');
const { Favorite, Review, User } = require('../models/index');
const { Op } = require('sequelize');
const Fuse = require('fuse.js');

const getProductListService = async (queryString, userId = null) => {
    try {
        const { 
            page, limit, 
            keyword, 
            category, // FE gửi dạng: "Apple,Samsung"
            ram,      // FE gửi dạng: "8GB,12GB"
            sort 
        } = queryString;

        const _page = page ? parseInt(page) : 1;
        const _limit = limit ? parseInt(limit) : 8;

        // Helper: Chuyển chuỗi "A,B" thành mảng cho SQL [Op.in]
        const buildFilterIn = (param) => {
            if (!param) return undefined;
            if (Array.isArray(param)) return { [Op.in]: param }; // Đề phòng FE gửi mảng
            if (param.includes(',')) return { [Op.in]: param.split(',') };
            return { [Op.in]: [param] };
        };

        // --- 1. XÂY DỰNG BỘ LỌC CỨNG (Hãng, RAM) ---
        let whereClause = {};

        // Lọc RAM
        if (ram) whereClause.ram = buildFilterIn(ram);

        // Lọc Category (Include model)
        let includeClause = [{ 
            model: Category, 
            attributes: ['id', 'name'],
            where: {} 
        }];

        if (category) {
            includeClause[0].where.name = buildFilterIn(category);
        } else {
            delete includeClause[0].where; // Bỏ where nếu không lọc category
        }

        // --- 2. XỬ LÝ LOGIC TÌM KIẾM ---
        let finalProducts = [];
        let totalCount = 0;

        // TRƯỜNG HỢP A: CÓ TỪ KHÓA -> Dùng Fuse.js (Fuzzy Search)
        if (keyword && keyword.trim() !== '') {
            // A1. Lấy TOÀN BỘ sản phẩm thỏa mãn điều kiện RAM/Category (Bỏ limit DB)
            const allProducts = await Product.findAll({
                where: whereClause,
                include: includeClause,
                raw: true, 
                nest: true, // Để gom nhóm Category
                order: [['createdAt', 'DESC']]
            });

            // A2. Cấu hình tìm kiếm mờ
            const fuseOptions = {
                keys: ['name', 'Category.name'], // Tìm trong tên SP và tên Hãng
                threshold: 0.4, // 0.0: Chính xác tuyệt đối, 0.4: Chấp nhận sai sót nhẹ
                includeScore: true // Bao gồm điểm số (score) để sắp xếp kết quả
            };
            const fuse = new Fuse(allProducts, fuseOptions);
            
            // A3. Thực hiện tìm kiếm
            const searchResults = fuse.search(keyword);
            
            // Lấy ra mảng item gốc
            let items = searchResults.map(result => result.item);

            // A4. Sắp xếp kết quả tìm kiếm (Sort thủ công bằng JS)
            if (sort) {
                if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
                if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
                if (sort === 'sold-desc') items.sort((a, b) => b.sold - a.sold);
                // Mặc định Fuse đã sort theo độ giống (score) nên không cần sort createdAt
            }

            totalCount = items.length;

            // A5. Phân trang thủ công (Cắt mảng)
            const startIndex = (_page - 1) * _limit;
            finalProducts = items.slice(startIndex, startIndex + _limit);

        } 
        // TRƯỜNG HỢP B: KHÔNG TỪ KHÓA -> Dùng SQL thuần (Tối ưu DB)
        else {
            const offset = (_page - 1) * _limit;
            
            // Xây dựng Order cho SQL
            let orderClause = [['createdAt', 'DESC']]; // Mặc định: Mới nhất
            if (sort) {
                if (sort === 'price-asc') orderClause = [['price', 'ASC']];
                if (sort === 'price-desc') orderClause = [['price', 'DESC']];
                if (sort === 'sold-desc') orderClause = [['sold', 'DESC']];
            }

            const { count, rows } = await Product.findAndCountAll({
                where: whereClause,
                include: includeClause,
                order: orderClause,
                offset: offset,
                limit: _limit,
                // raw: true, nest: true // Có thể bật nếu muốn object thuần
            });

            totalCount = count;
            // Chuyển đổi Sequelize object sang JSON thường để đồng nhất dữ liệu output
            finalProducts = rows.map(r => r.toJSON ? r.toJSON() : r);
        }

        // --- 3. GẮN THÊM CỜ isFavorite (Nếu cần) ---
        // (Logic này giữ nguyên hoặc đơn giản hóa như bạn đang làm)
        const products = finalProducts.map(product => ({
            ...product,
            isFavorite: false // Tạm thời false, xử lý logic user sau nếu cần
        }));

        return {
            totalRows: totalCount,
            totalPages: Math.ceil(totalCount / _limit),
            currentPage: _page,
            products: products
        };

    } catch (error) {
        console.error("ProductService Error:", error);
        return null;
    }
}

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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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