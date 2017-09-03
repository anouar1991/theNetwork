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
function sendToken(shop) {
    var nodemailer = require('nodemailer');
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'anouar1991belhadj@gmail.com',
            pass: 'anouar4ever@'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"N-store"<anouar1991belhadj@gmail.com> ', // sender address
        to: shop.email, // list of receivers
        subject: 'Shop Verification', // Subject line
        text: 'Shop Verification Code', // plain text body
        html: 'Shop Verification Code : <b>' + shop.verificationToken + '</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};

exports.create = function(req, res) {
    var shop = new Shop(req.body);
    shop.user = req.user;
    shop.verified = false;
    var token = crypto.createHash('sha256');
    token.update('' + shop.email + shop._id);
    shop.verificationToken = token.digest('hex');


    shop.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            sendToken(shop);
            console.log("original url", req.connection.remoteAddress);
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
            console.log(req.query.apiToken);
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
            } else if(shop){
                shop.verified = true;             
                console.log("now :" + shop.verified);
                shop.save(function(err) {

                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        })
                    } else {
                        return res.status(200).jsonp(shop)
                    };
                })
            }else{
                return res.status(400).send({
                            message: "no shop was found"
                        })
            }
        })
    }
};

exports.setDemandToken = function(req, res) {
    if (req.params.verificationToken) {
        Shop.findOne({
            verificationToken: req.params.verificationToken
        }, function(err, shop) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                shop.demandToken = req.body.demandToken;
                shop.url = req.body.url;
                shop.save(function(err) {
                    return (
                        (err) ?
                        res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        }) :
                        res.status(200).jsonp(shop)
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
exports.shopApiTokenVerification = function(req, res, next) {
    var requestToken = (req.query.apiToken) ? req.query.apiToken : false
    if (requestToken) {
        Shop.findOne({
            verificationToken: req.query.apiToken,
            verified: true
        }, function(err, shop) {
            if (err) {
                return (res.status(400).jsonp({
                    message: errorHandler.getErrorMessage(err)
                }));
            } else {
                if (shop) {
                    req.requestShop = shop;
                } else {
                    return (res.status(400).jsonp({
                        message: "invalid Token or Not Verified"
                    }));
                }
            }
        })
    } else {
        return res.status(500).jsonp({ message: 'no token' });
    };
    next();
}
