// Shops service used to communicate Shops REST endpoints
(function () {
  'use strict';

  angular
    .module('shops')
    .factory('ShopsService', ShopsService);

  ShopsService.$inject = ['$resource'];

  function ShopsService($resource) {
    return $resource('api/shops/:shopId', {
      shopId: '@_id',
      apiToken:'12480a9052ce880b4d01d3316182d4a5a709aab0277a820d921e463a0cded078'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
