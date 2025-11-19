const User = require('./user');
const Role = require('./role');
const Product = require('./product');
const { sequelize } = require('../config/database');

// Định nghĩa quan hệ: 1 Role có nhiều User, 1 User thuộc về 1 Role
Role.hasMany(User);
User.belongsTo(Role);

const initDatabase = async () => {
    try {
        // force: true sẽ XÓA bảng cũ và tạo lại (Dùng cẩn thận!)
        await sequelize.sync({ force: false, alter: true }); 
        console.log(">>> Database & Tables Synced!");
        
        // Tự động tạo Role mẫu nếu chưa có
        await seedRoles();
        await seedProducts();
    } catch (error) {
        console.error(">>> Error syncing database:", error);
    }
};

// Hàm tạo dữ liệu mẫu
const seedRoles = async () => {
    const count = await Role.count();
    if (count === 0) {
        await Role.bulkCreate([
            { url: '/admin', description: 'Admin' },
            { url: '/user', description: 'User' }
        ]);
        console.log(">>> Created default roles: Admin & User");
    }
}

const seedProducts = async () => {
    const count = await Product.count();
    if (count === 0) {
        const sampleImage = "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-flip-7-1.jpg";
        
        let products = [];
        for(let i = 1; i <= 50; i++) {
            products.push({
                name: `Samsung Galaxy Z Flip 6 - Bản Demo ${i}`,
                price: 20000000 + (i * 100000),
                image: sampleImage,
                description: `Siêu phẩm màn hình gập thế hệ mới. Sản phẩm mẫu số ${i}.`
            });
        }
        
        await Product.bulkCreate(products);
        console.log(">>> SEEDED: Đã tự động tạo 50 sản phẩm mẫu!");
    }
}

module.exports = { User, Role, Product, initDatabase };