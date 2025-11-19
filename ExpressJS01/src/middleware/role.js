// Middleware chỉ cho phép Admin truy cập
const checkAdmin = (req, res, next) => {
    // req.user đã có dữ liệu từ middleware auth chạy trước đó
    if (!req.user) {
        return res.status(401).json({
            message: "Bạn chưa đăng nhập"
        });
    }

    // Kiểm tra role (Lưu ý: Database của bạn lưu description là 'Admin' hay 'admin' thì so sánh y hệt vậy)
    if (req.user.role === 'Admin') {
        next(); // Là Admin -> Cho phép đi tiếp
    } else {
        return res.status(403).json({
            message: "Forbidden: Bạn không có quyền Admin để truy cập tài nguyên này"
        });
    }
}

module.exports = { checkAdmin };