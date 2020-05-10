const mongoose = require('mongoose');
const Product = require('../models/product');

// To get all data from Database
exports.product_get_all = (req, res, next) => {

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
 }

 // To create new product
 exports.product_create = (req, res, next) => {
    
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
}

// See the specific data (_id:) from Database
exports.product_get_single = (req, res, next) => {
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
}


exports.product_update = (req, res, next) => {
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
}

// Delete the data from Database
exports.product_delete = (req, res, next) => {
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

}