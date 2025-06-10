//import express
const express = require('express')

//init express router
const router = express.Router();

const CategoriesController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');

//import validate post
const { validatePost } = require('../utils/validator');

router.get('/categories', CategoriesController.findCategories);

//define route for create post
router.post('/categories', validatePost, CategoriesController.createCategories);

router.get('/categories/:id', CategoriesController.findCategoryById);

router.put('/categories/:id', CategoriesController.updateCategory);

router.delete('/categories/:id', CategoriesController.deleteCategory);

router.post('/products', validatePost, ProductController.createProduct);
router.get('/products', validatePost, ProductController.findProducts);
router.put('/products/:id', validatePost, ProductController.updateProduct);
router.post('/products/request-inventory', validatePost, ProductController.requestStock);
router.get('/products/request-log', validatePost, ProductController.getProductLogs);


module.exports = router