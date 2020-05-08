require('dotenv').config();  // Requiring .env File
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev')); // To get Methods logs in console 
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// To set Default Promise and To avoid Deprecation Warnings
mongoose.Promise = global.Promise;

// All Connection Events
// When successfully connected to URL
mongoose.connection.on('connected', function () {
    console.log('Connection open to: \n' +dbUri);
}); 
        
// If the connection throws an error
mongoose.connection.on('error', function (err) { 
    console.log('Mongoose default connection error: ' +err);
}); 
  

// Handling Cors
// Cross-Origin Resource Sharing
app.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        '*'
    ); 
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, PUT, POST, PATCH, DELETE'
        );
        return res.status(200).json({});
    }
    next()
});

// Routing to the Destination Files
app.use('/products', productRoutes); // ('/Route_Name', Handler)
app.use('/orders', orderRoutes); // ('/Route_Name', Handler)

// Error Handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
}); 

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app; 