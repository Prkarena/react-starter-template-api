/**
 * User modal
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config').get(process.env.NODE_ENV);
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v); // regex for email
            },
            message: props => `${props.value} is not a valid email!`
        },
        unique: 1
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password length must be >= 8'],
        validate: {
            validator: function (v) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/.test(v); //regex for email: small/capital/number/special
            },
            message: props => `${props.value} is not a valid password.it must contain at least one small and capital alphabet, numbers and special characters.`
        },
    },
    type: {  // type : 0 -> editor / user , 1 -> admin
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
}, {

})

// custom error if email already exists 
userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists.'));
    } else {
        console.log('error', error)
        next(error);
    }
});

// encrypt password before save
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
});

// comparePassword
userSchema.methods.comparePassword = (candidatePassword, password) => new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, function (err, isMatch) {
        if (err) reject(err);
        resolve(isMatch)
    })
});

// generate token with expire time = 10 min and save in perticuler user when user makes login 
userSchema.methods.generateToken = async user => {
    var token = await jwt.sign({ data: user._id.toHexString() }, config.SECRET, { expiresIn: "10m" }); // set expiration time here
    user.token = await token;
    return user.save();
};

// verify token is valid or not for perticuler user
userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    jwt.verify(token, config.SECRET, function (err, decode) {
        if (err) return cb(new Error('User session expired'));
        if (decode) {
            user.findOne({ "_id": decode.data, "token": token }, function (err, user) {
                if (err) return cb(new Error('User not authorized.'));
                cb(null, user)
            })
        } else {
            return cb(err)
        }
    })
}

const User = mongoose.model('User', userSchema);
module.exports = User;