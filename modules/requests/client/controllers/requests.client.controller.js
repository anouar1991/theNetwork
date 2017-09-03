(function() {
    'use strict';

    // Requests controller
    angular
        .module('requests')
        .controller('RequestsController', RequestsController);

    RequestsController.$inject = ['$scope', '$state', '$window', '$http', 'ShopsService', 'Authentication', 'requestResolve'];

    function RequestsController($scope, $state, $window, $http, ShopsService, $timeout, $dialog, Authentication, request) {
        var vm = this;


        vm.authentication = Authentication;
        vm.request = request;
        vm.error = null;

        vm.form = {
            title: '',
            customer: {},
            shops: [],
            products: [],
        };

        vm.shops = ShopsService.query();
        vm.remove = remove;
        vm.save = save;
        vm.product = {};
        vm.product.title = "";
        vm.product.description = "";
        vm.product.attributes = {};
        vm.product.tags = [];

        vm.product.add = function() {
            vm.form.products.push({
                title: this.title,
                description: this.description,
                attributes: this.attributes
            });
            this.title = "";
            this.description = "";
            this.attributes = {};
            this.tags = [];
        };

        vm.product.delete = function(i) {
            if (window.confirm("Are you sure you want to delete it ?"))
                vm.form.products.splice(i, 1);
        }

        vm.product.addAttribute = function(k, v) {
            this.attributes[k] = v;
            $('#attributeKey').focus();

        };
        vm.product.deleteAttribute = function(attr) {
            delete this.attributes[attr];
        };
        vm.product.editAttribute = function(attr) {
            $('#attributeKey').val(attr);
            $('#attributeValue').focus();
        }

        $http.get('/api/customers')
            .then(function(response) {
                vm.customers = response.data;
                vm.customers.selectCustomer = function(customer) {
                    vm.form.customer = customer;
                };
            });

        vm.submitRequest = function() {
            console.log(vm.form);

            $http.post('/api/requests', (vm.form))
                .then(function(response) {
                        if (response.data) {
                            console.log(response.data);
                        }
                    },
                    function(response) {
                        console.log(response);
                    }
                );

        };
        //add a shop id manually
        vm.shops.addshop = function(shop) {
            if (vm.form.shops.indexOf(shop._id) != -1) return;
            vm.form.shops.push(shop._id);
        };
        //add all shops [to debug]
        vm.shops.addAll = function(){
            for( shop in vm.shops){
                vm.shops.addshop(shop);
            }
        }
        // Remove existing Request
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.request.$remove($state.go('requests.list'));
            }
        }

        // Save Request
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.requestForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.request._id) {
                vm.request.$update(successCallback, errorCallback);
            } else {
                vm.request.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('requests.view', {
                    requestId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
