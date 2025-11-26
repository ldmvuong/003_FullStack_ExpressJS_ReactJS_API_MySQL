const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Tên hãng không trùng nhau
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false 
});

module.exports = Category;