const { Product, Category } = require('../models/index');
const { Op } = require('sequelize');

const getProductListService = async (queryString) => {
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
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            include: includeClause, // JOIN bảng Category
            offset: offset,
            limit: _limit,
            order: orderClause
        });

        return {
            totalRows: count,
            totalPages: Math.ceil(count / _limit),
            currentPage: _page,
            products: rows
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { getProductListService };