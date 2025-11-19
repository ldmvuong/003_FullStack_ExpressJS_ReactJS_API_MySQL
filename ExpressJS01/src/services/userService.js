require("dotenv").config();
const { User, Role } = require("../models/index");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        // 1. Check user exist
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }

        // 2. Hash password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // 3. Tìm Role mặc định là "User" trong database
        // (Đảm bảo bạn đã chạy server để hàm seedRoles tạo dữ liệu mẫu rồi nhé)
        const userRole = await Role.findOne({ where: { description: 'User' } });

        // 4. Save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            // Gán khóa ngoại RoleId thay vì lưu string "User"
            RoleId: userRole ? userRole.id : null 
        });
        
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async (email, password) => {
    try {
        // 1. Fetch user by email và lấy kèm thông tin Role
        const user = await User.findOne({ 
            where: { email: email },
            include: { model: Role } // Eager loading: Join bảng Role
        });

        if (user) {
            // 2. Compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                }
            } else {
                // 3. Create access token
                // Lấy role từ bảng Role (user.Role.description) 
                // Nếu user chưa có role thì mặc định là 'User' để không lỗi
                const roleName = user.Role ? user.Role.description : 'User';

                const payload = {
                    email: user.email,
                    name: user.name,
                    role: roleName // Lưu chuỗi "Admin" hoặc "User" vào token
                }
                
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name,
                        role: roleName
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {
    try {
        // Lấy danh sách user kèm theo Role của họ để hiển thị
        let result = await User.findAll({
            attributes: { exclude: ['password'] },
            include: { model: Role } 
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createUserService, loginService, getUserService
}