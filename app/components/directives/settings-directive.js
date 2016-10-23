angular.module('settingsDirective', [])

  .directive('settings', function () {
    return {
      restrict: 'E',
      transclude: true,
      controller: 'SettingsController',
      controllerAs: 'settingsCtrl',
      link: function (scope, element, attribute) {
        $('.collapsible').collapsible({ accordion: false });
        // A setting that changes the collapsible behavior to expandable instead of the default accordion style 
      },
      scope: false,
      templateUrl: 'components/partials/settings.html',
      replace: true
    };
  })