const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());

//database connection
const connectDB = require('./db/connections');
connectDB();

app.use('/api/', require('./routes/user').router);

// route not found
app.use('*', function (req, res, next) {
    next(new Error('Route not found.'))
})

//global error handler
app.use((err, req, res, next) => {
    res.status(err.status || 402).json({
        success: 0,
        message: err.message && err.message || 'Error while making request'
    })
});

//port 
const Port = process.env.PORT || 3030;

app.listen(Port, () => {
    console.log(`server is running on port ${Port}`);
})


