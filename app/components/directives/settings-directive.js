angular.module('settingsDirective', [])

.directive('settings', function() {
    return {
        restrict: 'E',
        transclude: true,
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl',
        scope: false,
        templateUrl: 'components/partials/settings.html',
        replace: true
    };
})