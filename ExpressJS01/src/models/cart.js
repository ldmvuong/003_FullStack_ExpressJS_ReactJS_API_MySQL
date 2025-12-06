const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
    // Chỉ cần ID, UserId sẽ tự có qua quan hệ
}, { timestamps: true });

module.exports = Cart;