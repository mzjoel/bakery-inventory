const express = require('express')

const router = express.Router();


const UserController = require('../controllers/UserController');


router.post('/user/register', UserController.register);
router.post('/user/logout', UserController.logout);
router.post('/user/login', UserController.login);
// router.put('/user/:id', UserController.update);
// router.delete('/user/:id', UserController.delete);


module.exports = router