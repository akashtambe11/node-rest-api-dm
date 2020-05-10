const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Signup for new User
exports.user_signup = (req, res, next) => {
    
    User
        .find({email: req.body.email}) // To handle error for dublicate email id
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: "User ID already exist"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created: ' + req.body.email
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

// Login for existing Users
exports.user_login = (req, res, next) => {

    User
        .find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: "Authentication Failed X!"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: "Authentication Failed X!"
                    });
                }
                if(result) {
                    //JWT Token
                    const token = jwt.sign(
                        {
                        email: user[0].email,
                        userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1hr"
                        }
                    )
                    return res.status(200).json({
                        message: "Authentication Succesful! :)",
                        token: token
                    });
               } 
                res.status(401).json({
                    message: "Authentication Failed X!"
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

// To Delete Users
exports.user_delete = (req, res, next) => {

    User
        .remove({_id: req.params.userId})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User has been Deleted Successfully',
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}