// var app = angular
//   .module('myApp', [
//     'ngRoute',
//     'Dashboard.DashboardController'
//   ]);

// app.config(configFunction);

// function configFunction($routeProvider, $locationProvider) {
//   $routeProvider
//     .when('/', {
//       templateUrl: './components/partials/dashboard.html',
//       controller: 'DashboardController'
//     })
// }

const app = angular.module('myApp', [])
 .controller('DashboardController', function ($scope) {
   $scope.testvariable = 'long Mc. Dick'
 })
   //should change watched to object full of videos as keys, for faster lookup time;
   //augment so watchjs is not needed; use query string on 
//    $scope.setAsWatched = function (index) {
//      $scope.newVideo($scope.queue[index].url)
//      $scope.watched.push($scope.queue[index]._id);
//      $scope.updateQueue();
//      jQuery.post('/watched', { data: $scope.watched });
//    }
//    $scope.getData = function () {

//    }
//    $scope.updateQueue = function () {
//      const newVideos = [];
//      for (let video of $scope.videos) {
//        if ($scope.watched.indexOf(video._id) == -1) {
//          if (/youtube/.test(video.url)) {
//            newVideos.push(video);
//          }
//          if (newVideos.length === 5) break;
//        }
//      }
//      $scope.queue = newVideos;
//    }
//    $scope.updateQueue();
//  })
//  .directive("hashLi", function () {
//    return {
//      restrict: "E",
//      template: "<li>{{fileName}}</li>"
//    };
//  });