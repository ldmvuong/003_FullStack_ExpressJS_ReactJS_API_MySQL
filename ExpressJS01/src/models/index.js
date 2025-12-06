const User = require('./user');
const Role = require('./role');
const Category = require('./category');
const Product = require('./product');
const Favorite = require('./favorite');
const Review = require('./review');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const { sequelize } = require('../config/database');

// 1. Định nghĩa quan hệ
Role.hasMany(User);
User.belongsTo(Role);

// Một Danh mục có nhiều Sản phẩm (VD: Samsung có S23, S24...)
Category.hasMany(Product);
Product.belongsTo(Category);

// Favorite: Many-to-Many User <-> Product
User.belongsToMany(Product, { through: Favorite });
Product.belongsToMany(User, { through: Favorite });

// Also set up direct associations with Favorite table for easier querying
Favorite.belongsTo(User, { foreignKey: 'UserId' });
Favorite.belongsTo(Product, { foreignKey: 'ProductId' });
User.hasMany(Favorite, { foreignKey: 'UserId' });
Product.hasMany(Favorite, { foreignKey: 'ProductId' });

// Reviews
User.hasMany(Review);
Review.belongsTo(User);

Product.hasMany(Review);
Review.belongsTo(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

Product.hasMany(CartItem);
CartItem.belongsTo(Product);

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

        // 2. Mảng hình ảnh từ các nguồn khác nhau (không bị chặn)
        const phoneImages = {
            Apple: [
                'https://images.unsplash.com/photo-1592286116501-c0b5a7b0f767?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1611791483434-029afacaa414?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1595439144693-bae4e4ac72fc?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
                'https://picsum.photos/400/400?random=1'
            ],
            Samsung: [
                'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1603444078542-8d51b7e2e678?w=400&h=400&fit=crop',
                'https://picsum.photos/400/400?random=2',
                'https://picsum.photos/400/400?random=3',
                'https://picsum.photos/400/400?random=4'
            ],
            Xiaomi: [
                'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1569486478800-e0ef766d5645?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
                'https://picsum.photos/400/400?random=5',
                'https://picsum.photos/400/400?random=6',
                'https://picsum.photos/400/400?random=7'
            ],
            Oppo: [
                'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
                'https://picsum.photos/400/400?random=8',
                'https://picsum.photos/400/400?random=9',
                'https://picsum.photos/400/400?random=10'
            ]
        };

        // 3. Tên sản phẩm thật theo từng hãng
        const phoneModels = {
            Apple: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro'],
            Samsung: ['Galaxy S24 Ultra', 'Galaxy S24 Plus', 'Galaxy S24', 'Galaxy Z Fold5', 'Galaxy Z Flip5', 'Galaxy A55 5G'],
            Xiaomi: ['Xiaomi 14T Pro', 'Xiaomi 14T', 'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi 12', 'POCO X6 Pro 5G'],
            Oppo: ['Reno12 F 5G', 'A3x', 'Reno12 Pro 5G', 'Reno12 5G', 'Find N3 Flip', 'A58 Pro']
        };

        let products = [];
        const specs = {
            ram: ['6GB', '8GB', '12GB', '16GB'],
            rom: ['128GB', '256GB', '512GB', '1TB'],
            screen: ['6.1 inch Super Retina XDR', '6.7 inch Dynamic AMOLED 2X', '6.8 inch LTPO AMOLED', '6.43 inch AMOLED'],
            battery: ['4400mAh', '5000mAh', '4500mAh', '5500mAh']
        };
        
        // Tạo sản phẩm cho từng hãng
        cats.forEach((cat, catIndex) => {
            const brandImages = phoneImages[cat.name] || [];
            const brandModels = phoneModels[cat.name] || [];
            
            for(let i = 0; i < 12; i++) { // 12 sản phẩm mỗi hãng
                const modelIndex = i % brandModels.length;
                const imageIndex = i % brandImages.length;
                
                const randomRam = specs.ram[Math.floor(Math.random() * specs.ram.length)];
                const randomRom = specs.rom[Math.floor(Math.random() * specs.rom.length)];
                
                // Giá theo hãng (Apple đắt nhất, Xiaomi rẻ nhất)
                let basePrice;
                switch(cat.name) {
                    case 'Apple': basePrice = (25 + Math.floor(Math.random() * 25)) * 1000000; break; // 25-50tr
                    case 'Samsung': basePrice = (15 + Math.floor(Math.random() * 20)) * 1000000; break; // 15-35tr
                    case 'Oppo': basePrice = (8 + Math.floor(Math.random() * 17)) * 1000000; break; // 8-25tr
                    case 'Xiaomi': basePrice = (5 + Math.floor(Math.random() * 15)) * 1000000; break; // 5-20tr
                    default: basePrice = 10000000;
                }

                products.push({
                    name: `${brandModels[modelIndex]} (${randomRam}/${randomRom})`,
                    price: basePrice,
                    discount: Math.floor(Math.random() * 15), // Giảm giá 0-15%
                    sold: Math.floor(Math.random() * 1000),   // Đã bán 0-1000 cái
                    image: brandImages[imageIndex] || 'https://via.placeholder.com/300x300?text=No+Image',
                    
                    // Specs chi tiết
                    ram: randomRam,
                    rom: randomRom,
                    screen: specs.screen[Math.floor(Math.random() * specs.screen.length)],
                    battery: specs.battery[Math.floor(Math.random() * specs.battery.length)],
                    description: `${brandModels[modelIndex]} chính hãng, bảo hành 12 tháng. Thiết kế cao cấp, hiệu năng mạnh mẽ.`,
                    
                    // Gán khóa ngoại CategoryId
                    CategoryId: cat.id 
                });
            }
        });
        
        await Product.bulkCreate(products);
        console.log(`>>> Created ${products.length} phones with real images!`);
    }
}

module.exports = { User, Role, Category, Product, Favorite, Review, Cart, CartItem, initDatabase };