angular.module('publishDirective', ['PublishController'])


.directive('publishCard', function() {
    return {
        restrict: 'E',
        transclude: true,
        controller: 'PublishController',
        controllerAs: 'pubCtrl',
        scope: false,
        templateUrl: 'components/partials/publishCard.html',
        replace: true
    };
})