angular
    .module("requests")
    .directive("displayProducts", function() {
        return {
            templateUrl: 'modules/requests/views/partials/display-products.html'
        };
    });
angular
    .module("requests")
    .directive("searchCustomer", function() {
        return {
            templateUrl: 'modules/requests/views/partials/search-customer.html'
        };
    });
angular
    .module("requests")
    .directive("productContainer", function() {
        return {
            templateUrl: 'modules/requests/views/partials/product-container.html'
        };
    });
