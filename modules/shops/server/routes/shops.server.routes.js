'use strict';

/**
 * Module dependencies
 */
var shopsPolicy = require('../policies/shops.server.policy'),
    shops = require('../controllers/shops.server.controller');

module.exports = function(app) {
    //token verification middle ware 
    // app.use('/api/shops',shops.shopApiTokenVerification);
    // Shops Routes
    app.use('/api/shops', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.route('/api/shops').all(shopsPolicy.isAllowed)
        .get(shops.list)
        .post(shops.create);
    app.route('/api/shops/login')
        .post(shops.login);
    app.route('/api/shops/deleteAll')
        .get(shops.deleteAll);
    app.route('/api/shops/verify/:verificationToken')
        .get(shops.verify)
        .post(shops.setDemandToken);
    app.route('/api/shops/:shopId').all(shopsPolicy.isAllowed)
        .get(shops.read)
        .put(shops.update)
        .delete(shops.delete);

    // Finish by binding the Shop middleware
    app.param('shopId', shops.shopByID);
};
