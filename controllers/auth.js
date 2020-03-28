const User = require('../modals/user'); // User Modal

module.exports.auth = (req, res, next) => {
    if (!req.headers['x-auth']) next(new Error('User not authorized.'));
    let token = req.headers['x-auth'];
    User.findByToken(token, (err, user) => {
        if (err) next(err);
        if (!user) next(new Error('User not authorized.'));
        req.user = user;
        next();
    })
}