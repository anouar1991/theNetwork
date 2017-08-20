'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Shop = mongoose.model('Shop'),
    crypto = require('crypto'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Shop
 */
exports.create = function(req, res) {
    var shop = new Shop(req.body);
    shop.user = req.user;
    shop.verified = false;
    var token = crypto.createHash('sha256');
    token.update('' + shop.email + shop._id);
    shop.verificationToken = token.digest('hex');
    shop.password = crypto.createHash('sha256').update(shop.password).digest('hex');


    shop.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shop);
        }
    });
};

/**
 * Show the current Shop
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var shop = req.shop ? req.shop.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    shop.isCurrentUserOwner = req.user && shop.user && shop.user._id.toString() === req.user._id.toString();

    res.jsonp(shop);
};

/**
 * Update a Shop
 */
exports.update = function(req, res) {
    var shop = req.shop;

    shop = _.extend(shop, req.body);

    shop.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shop);
        }
    });
};

/**
 * Delete an Shop
 */
exports.delete = function(req, res) {
    var shop = req.shop;

    shop.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shop);
        }
    });
};
/**
 * List of Shops
 */
exports.list = function(req, res) {
    Shop.find().sort('-created').populate('user', 'displayName').exec(function(err, shops) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shops);
        }
    });
};
/**
 *  Shop Verification
 */
exports.verify = function(req, res) {
    if (req.params.verificationToken) {
        Shop.findOne({
            verificationToken: req.params.verificationToken
        }, function(err, shop) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                console.log("before :" + shop.verified);
                shop.verified = true;

                console.log("now :" + shop.verified);
                shop.save(function(err) {
                    return (

                        (err) ?
                        res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        }) :
                        res.status(200).send(shop.verified)
                    );
                })
            }
        })
    }
};
exports.login = function(req, res) {
    if (req.body.email) {
        Shop.findOne({
            email: req.body.email,
        }, function(err, shop) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                })
            } else if (shop) {
                var password = (crypto.createHash('sha256').update(req.body.password).digest('hex'));
                if (shop.password == (crypto.createHash('sha256').update(req.body.password).digest('hex'))) {
                    return res.status(200).send(shop);
                } else {
                    return res.status(400).send({
                        message: 'incorrect password'
                    });
                }
            } else {
                return res.status(400).send({
                    message: 'shop doesn\'t exist'
                });
            }
        })
    }
}
exports.deleteAll = function(req, res) {
    Shop.remove({}, function(err) {
        if (err) {
            res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(200).send({
                message: 'deleted all'
            });
        }
    })
}
/**
 * Shop middleware
 */
exports.shopByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Shop is invalid'
        });
    }

    Shop.findById(id).populate('user', 'displayName').exec(function(err, shop) {
        if (err) {
            return next(err);
        } else if (!shop) {
            return res.status(404).send({
                message: 'No Shop with that identifier has been found'
            });
        }
        req.shop = shop;
        next();
    });
};
