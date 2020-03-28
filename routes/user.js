const express = require('express');
const router = express.Router();
// controllers
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

// user registration 
router.post('/sign-up', userController.registerUserValidation, userController.registerUser);

// user login
router.post('/sign-in', userController.signInUserValidation, userController.signInUser);

// auth 
router.get('/auth', authController.auth, userController.checkAuth);

// get users : only admin(type:1) can access 
router.get('/get-users', authController.auth, userController.getUsers);

// get user
router.get('/get-user/:userId', authController.auth, userController.getUser);

module.exports = {
    router
}