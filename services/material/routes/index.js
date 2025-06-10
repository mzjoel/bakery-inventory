//import express
const express = require('express')

//init express router
const router = express.Router();

const CategoriesController = require('../controllers/CategoryController');
const MaterialController = require('../controllers/MaterialController');

//import validate post
const { validatePost } = require('../utils/validator');

router.get('/categories', CategoriesController.findCategories);

//define route for create post
router.post('/categories', validatePost, CategoriesController.createCategories);

router.get('/categories/:id', CategoriesController.findCategoryById);

router.put('/categories/:id', CategoriesController.updateCategory);

router.delete('/categories/:id', CategoriesController.deleteCategory);

router.post('/materials', validatePost, MaterialController.createMaterial);
router.get('/materials', validatePost, MaterialController.findMaterials);
router.put('/materials/:id', validatePost, MaterialController.updateMaterial);
router.post('/materials/request-inventory', validatePost, MaterialController.requestStock);
router.get('/materials/request-log', validatePost, MaterialController.getMaterialLogs);


module.exports = router