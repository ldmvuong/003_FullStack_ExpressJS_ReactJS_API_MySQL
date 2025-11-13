const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import instance sequelize từ Bước 4

const User = sequelize.define('User', {
  // Model attributes được định nghĩa ở đây
  name: {
    type: DataTypes.STRING,
    allowNull: true // Tương đương 'name: String' trong Mongoose [cite: 445]
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Bắt buộc phải có
    unique: true      // Email phải là duy nhất
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false // Bắt buộc phải có [cite: 450]
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'User' // Giá trị mặc định là 'User' [cite: 451]
  }
}, {
  // Các tùy chọn khác
  // Tắt tự động thêm 'createdAt' và 'updatedAt'
  // Giống Mongoose, schema gốc không định nghĩa timestamps
  timestamps: false 
});

// Tự động đồng bộ model với database (tạo bảng 'Users' nếu chưa có)
(async () => {
  await sequelize.sync();
  console.log("User table (and model) synced!");
})();

module.exports = User;