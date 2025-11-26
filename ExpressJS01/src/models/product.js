const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    discount: { // Phần trăm giảm giá (VD: 10%)
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    stock: { // Số lượng trong kho
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    sold: { // Số lượng đã bán (để sort theo 'bán chạy')
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    image: {
        type: DataTypes.TEXT,
        defaultValue: "https://via.placeholder.com/150"
    },
    // --- CẤU HÌNH CHI TIẾT ĐIỆN THOẠI ---
    ram: { // VD: "8GB", "12GB"
        type: DataTypes.STRING, 
    },
    rom: { // Bộ nhớ trong: "128GB", "256GB"
        type: DataTypes.STRING,
    },
    screen: { // Màn hình: "6.7 inch OLED"
        type: DataTypes.STRING,
    },
    battery: { // Pin: "5000mAh"
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    }
    // Sequelize sẽ tự động thêm cột CategoryId khi thiết lập quan hệ
}, {
    timestamps: true 
});

module.exports = Product;