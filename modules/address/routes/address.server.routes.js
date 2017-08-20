'use strict';

/**
 * Module dependencies
 */
var addressesPolicy = require('../policies/addresses.server.policy'),
  addresses = require('../controllers/address.server.controller');

module.exports = function(app) {
  // Customers Routes
  app.route('/api/addresses')
    .get(addresses.list)
    .post(addresses.create);

  app.route('/api/addresses/:addressId')
    .get(addresses.read)
    .put(addresses.update)
    .delete(addresses.delete);

  // Finish by binding the Customer middleware
  app.param('addressId', addresses.addressByID);
};
