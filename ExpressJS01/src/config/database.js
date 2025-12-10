require('dotenv').config();
const { Sequelize } = require('sequelize');

// Khởi tạo một đối tượng Sequelize
// Nó sẽ đọc các biến trong file .env của bạn
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT, // 'mysql'
    logging: false // Tắt log SQL query ra console cho đỡ rối
  }
);

// Hàm kiểm tra kết nối đến database
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.info('Connected to MySQL database successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export cả instance 'sequelize' và hàm 'connection'
// Chúng ta sẽ cần 'sequelize' cho các Model
module.exports = { sequelize, connection };