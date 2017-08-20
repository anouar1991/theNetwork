angular
    .module("shops")
    .directive("verifiedBadge", function() {
        return {
            templateUrl: 'modules/shops/views/partials/verified-badge.html'
        };
    });