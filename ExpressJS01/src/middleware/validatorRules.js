const { body } = require('express-validator');

const registerRules = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
    body('name').notEmpty().withMessage('Tên không được để trống'),
];

const loginRules = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
];

const productRules = [
    body('name').notEmpty().withMessage('Tên sản phẩm bắt buộc'),
    body('price').isNumeric().withMessage('Giá phải là số'),
];

module.exports = {
    registerRules,
    loginRules,
    productRules
};