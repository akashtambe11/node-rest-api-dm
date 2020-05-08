const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

// Middleware
// To get all orders
router.get('/', (req, res, next) => {
    
    Order
        .find()
        .select('_id product quantity')
        .populate('product', 'name')    // (Details_object_name, populate property)
        .exec()
        .then(docs => {
            res.status(200).json({ 
                count: docs.length,
                orders: docs.map(doc => { 
                    return {
                        id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/'+doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// To create Order
router.post('/', (req, res, next) => {

    Product
        .findById(req.body.productId)
        .then(product => {
            // if(!product) {
            //     return res.status(404).json({
            //         message: "Product not Found"
            //     });
            // }
            // order = Collection Name
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            return order
                .save()  
            
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order Stored',
                createdOrder: {
                    id: result.id,
                    product: result.product,
                    quantity: result.quantity
                },  
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'+result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Product not Found',
                error: err
            });
        });
      
    
    
});

// To get specific Order
router.get('/:orderId', (req, res, next) => {
    Order
        .findById(req.params.orderId)
        .select('_id product quantity')
        .populate('product')    // To get all details of project instead of id only
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// To delete Order
router.delete('/:orderId', (req, res, next) => {
    
    Order
        .remove({_id: req.params.orderId})
        .exec()
        .then(order => {
            res.status(200).json({
                message: 'Order has been Deleted',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Order not Found',
                error: err
            });
        });
});


module.exports = router;