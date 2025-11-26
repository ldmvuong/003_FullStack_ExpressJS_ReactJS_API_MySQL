const User = require('./user');
const Role = require('./role');
const Category = require('./category'); // <--- Import mới
const Product = require('./product');
const { sequelize } = require('../config/database');

// 1. Định nghĩa quan hệ
Role.hasMany(User);
User.belongsTo(Role);

// Một Danh mục có nhiều Sản phẩm (VD: Samsung có S23, S24...)
Category.hasMany(Product);
Product.belongsTo(Category);

const initDatabase = async () => {
    try {
        // RESET lại DB để cập nhật cột mới (Chỉ dùng khi dev, cẩn thận mất dữ liệu)
        await sequelize.sync({ force: false, alter: true }); 
        console.log(">>> Database & Tables Synced!");
        
        await seedRoles();
        await seedCategoriesAndProducts(); // <--- Hàm seed mới xịn hơn
    } catch (error) {
        console.error(">>> Error syncing database:", error);
    }
};

const seedRoles = async () => {
    // ... (Code cũ giữ nguyên: tạo Admin/User)
    const count = await Role.count();
    if (count === 0) {
        await Role.bulkCreate([
            { url: '/admin', description: 'Admin' },
            { url: '/user', description: 'User' }
        ]);
        console.log(">>> Created default roles");
    }
}

// --- HÀM TẠO DỮ LIỆU ĐIỆN THOẠI MẪU ---
const seedCategoriesAndProducts = async () => {
    const countCat = await Category.count();
    if (countCat === 0) {
        // 1. Tạo Danh mục (Hãng)
        const cats = await Category.bulkCreate([
            { name: 'Apple', description: 'iPhone chính hãng' },
            { name: 'Samsung', description: 'Điện thoại Samsung Galaxy' },
            { name: 'Xiaomi', description: 'Điện thoại giá rẻ cấu hình cao' },
            { name: 'Oppo', description: 'Camera phone' }
        ]);

        console.log(">>> Created Categories: Apple, Samsung, Xiaomi, Oppo");

        // 2. Tạo Sản phẩm ngẫu nhiên theo hãng
        let products = [];
        const specs = {
            ram: ['4GB', '8GB', '12GB', '16GB'],
            rom: ['64GB', '128GB', '256GB', '512GB', '1TB'],
            screen: ['6.1 inch LCD', '6.7 inch OLED', '6.8 inch AMOLED 120Hz'],
            battery: ['4000mAh', '5000mAh', '4500mAh']
        };
        
        // Tạo 50 sản phẩm
        for(let i = 1; i <= 50; i++) {
            // Random hãng
            const randomCatIndex = Math.floor(Math.random() * cats.length);
            const selectedCat = cats[randomCatIndex];
            
            // Random cấu hình
            const randomRam = specs.ram[Math.floor(Math.random() * specs.ram.length)];
            const randomRom = specs.rom[Math.floor(Math.random() * specs.rom.length)];
            const price = (Math.floor(Math.random() * 30) + 5) * 1000000; // Giá từ 5tr - 35tr

            products.push({
                name: `${selectedCat.name} Phone Model ${i} (${randomRam}/${randomRom})`,
                price: price,
                discount: Math.floor(Math.random() * 20), // Giảm giá 0-20%
                sold: Math.floor(Math.random() * 1000),   // Đã bán 0-1000 cái
                image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-flip-7-1.jpg",
                
                // Specs chi tiết
                ram: randomRam,
                rom: randomRom,
                screen: specs.screen[Math.floor(Math.random() * specs.screen.length)],
                battery: specs.battery[Math.floor(Math.random() * specs.battery.length)],
                description: `Điện thoại ${selectedCat.name} chính hãng, bảo hành 12 tháng.`,
                
                // Gán khóa ngoại CategoryId
                CategoryId: selectedCat.id 
            });
        }
        
        await Product.bulkCreate(products);
        console.log(">>> Created 50 fake phones with detailed specs!");
    }
}

module.exports = { User, Role, Category, Product, initDatabase };