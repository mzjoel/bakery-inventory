//import express validator
const { body } = require('express-validator');

//definisikan validasi untuk post
const validatePost= [
    body('name').notEmpty().withMessage(' Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
];

module.exports = { validatePost };