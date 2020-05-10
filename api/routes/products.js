const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controller/products');

// To store image Data
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
}); 

// File Filter
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else{
        cb(null, false)
    }
};
// To declare destination for storing image data
const upload = multer({
    dest: 'uploads/',
    fileFilter: fileFilter
});

// Middleware
// To get all data from Database
router.get('/', ProductController.product_get_all);

// To create new product
router.post('/', checkAuth, upload.single('productImage'), ProductController.product_create);

// See the specific data (_id:) from Database
router.get('/:productId', ProductController.product_get_single);

// Update the Database
router.patch('/:productId', checkAuth, ProductController.product_update);

// Delete the data from Database
router.delete('/:productId', checkAuth, ProductController.product_delete);

// To export Router
module.exports = router;