const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

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

const upload = multer({
    dest: 'uploads/',
    fileFilter: fileFilter
});

const Product = require('../models/product');

// Middleware
// To get all data from Database
router.get('/', (req, res, next) => {

   Product
        .find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                product: docs.map(doc =>  {
                    return {
                        id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                error: err
            });
        });
});

// Client to Server
// Add data in Database
router.post('/', upload.single('productImage'),  (req, res, next) => {
    
    console.log(req.file);
    
   // product = Collection Name
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
        .save() // To save into Database
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created Product Successfully',
                createdProduct: {
                    id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/'+result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

// Server to Client
// See the specific data (_id:) from Database
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product
        .findById(id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json({
                    message: 'Fetched Object Successfully',
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCTS',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({message: 'No data availble for the given ID'});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
});

// Update the Database
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product
        .update(
            {_id: id},
            {$set: updateOps}
        ).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product has been updated Successfully',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Delete the data from Database
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product
        .remove({_id: id})
        .exec()
        .then(product => {
            res.status(200).json({
                message: 'Product has been deleted Successfully',
                request: {
                    type: 'GET',
                    description: 'GET_ALL_PRODUCTS',
                    url: 'http://localhost:3000/products/'
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

module.exports = router;