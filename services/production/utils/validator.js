const { body } = require('express-validator');

const validateProduction= [
    body('productId').notEmpty().withMessage('Product Id is required'),
    body('productName').notEmpty().withMessage('Product Name is required'),
    body('requestedQuantity').notEmpty.withMessage('Request Quantity is required'),
    body('requestBy').notEmpty.withMessage('Request By is required'),
];

module.exports = { validatePost };