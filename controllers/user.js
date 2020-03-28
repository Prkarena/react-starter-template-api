const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator'); //For Validation
const User = require('../modals/user'); // User Modal

/**
 * registerUser : /api/sign-up
 */

// registerUser Validation 
module.exports.registerUserValidation = [
    body('email').not().isEmpty(),
    body('password').not().isEmpty()
];

// registerUser : register new user 
module.exports.registerUser = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(200)
                .json({
                    success: 0,
                    message: errors.array() && errors.array().length ? `${errors.array()[0].param} ${errors.array()[0].msg}` : "All feilds are required"
                });
        } else {
            const user = new User(req.body);
            user
                .save()
                .then(data => {
                    res.status(200).json({ success: 1, message: 'User registered successfully.', username: data.email })
                })
                .catch(err => {
                    res.status(402).json({ success: 0, message: err.message })
                })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        })
    }
}

/**
 * signInUser : /api/sign-in
 */

// signInUser Validation 
module.exports.signInUserValidation = [
    body('email').not().isEmpty(),
    body('password').not().isEmpty()
];

// signInUser : signIn user 
module.exports.signInUser = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(200)
                .json({
                    success: 0,
                    message: errors.array() && errors.array().length ? `${errors.array()[0].param} ${errors.array()[0].msg}` : "email and password are required"
                });
        } else {
            let userData;
            User
                .findOne({ email: req.body.email })
                .then(data => {
                    if (!data) throw new Error('User not found.')
                    return data;
                })
                .then(user => {
                    userData = user
                    return userData.comparePassword(req.body.password, userData.password);
                })
                .then(isMatch => {
                    if (!isMatch) throw new Error('Password not matched.')
                    return userData.generateToken(userData);
                })
                .then(user => {
                    if (!user) throw new Error('Error While Login.')
                    res.status(200).json({
                        success: 1,
                        message: 'User Login successfully.',
                        email: user.email,
                        id: user._id,
                        type: user.type,
                        token: user.token
                    })
                })
                .catch(err => {
                    res.status(402).json({
                        success: 0,
                        message: err.message
                    })
                })
        }
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        })
    }
}

/**
 * checkAuth : check user is authenticated or not 
 */

module.exports.checkAuth = (req, res) => {
    try {
        res.status(200)
            .json({
                success: 1,
                message: 'Users is authorized.',
            })
    } catch (error) {
        res.status(error.status || 500).json({
            success: 0,
            message: error.message
        })
    }
}


/**
 * getUsers: /api/get-users 
 * return all users data if user is admin
 */

// getUsers : get users 
module.exports.getUsers = (req, res) => {
    try {
        if (req.user.type !== 1) throw new Error('User not authorized.');
        User
            .find({
                email: { $ne: req.user.email }
            }, {
                password: 0,
                token: 0
            })
            .then(users => {
                res.status(200).json({
                    success: 1,
                    message: 'Users get successfully.',
                    users
                })
            })
            .catch(err => {
                res.status(402).json({
                    success: 0,
                    message: err.message
                })
            })

    } catch (error) {
        res.status(error.status || 500).json({
            success: 0,
            message: error.message
        })
    }
}

/**
 * getUser: /api/get-users 
 * return user data by it's id  
 */

// getUsers : get user
module.exports.getUser = (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    try {
        User
            .findById(userId, {
                password: 0,
                token: 0
            })
            .then(user => {
                if (!user) throw new Error('User not found.')
                res.status(200).json({
                    success: 1,
                    message: 'User get successfully.',
                    user
                })
            })
            .catch(err => {
                res.status(402).json({
                    success: 0,
                    message: err.message
                })
            })
    } catch (error) {
        res.status(error.status || 500).json({
            success: 0,
            message: error.message
        })
    }
}

