// src/middleware/validate.js
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // Không có lỗi -> đi tiếp vào Controller
    }

    // Nếu có lỗi -> Trả về ngay lập tức
    const extractedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg,
    }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = validate;