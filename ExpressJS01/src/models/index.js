const User = require('./user');
const Role = require('./role');
const { sequelize } = require('../config/database');

// Định nghĩa quan hệ: 1 Role có nhiều User, 1 User thuộc về 1 Role
Role.hasMany(User);
User.belongsTo(Role);

const initDatabase = async () => {
    try {
        // force: true sẽ XÓA bảng cũ và tạo lại (Dùng cẩn thận!)
        await sequelize.sync({ force: true, alter: true }); 
        console.log(">>> Database & Tables Synced!");
        
        // Tự động tạo Role mẫu nếu chưa có
        await seedRoles();
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

module.exports = { User, Role, initDatabase };