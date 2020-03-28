const mongoose = require('mongoose');
const config = require('../config').get(process.env.NODE_ENV);

const URI = config.DATABASE;

const connectDB = async () => {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, db) {
        if (err) return console.log('error while connecting with database', err)
        console.log('database is connected')
    });
}

module.exports = connectDB;