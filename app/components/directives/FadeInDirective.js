
angular.module('FadeInEffect', [])
  .directive('fadeInEffect', function () {
    return {
      restrict: 'A',
      link: function ($scope, element) {
        var duration = 800;
        $(element).fadeIn(duration);
      }
    };
  })

