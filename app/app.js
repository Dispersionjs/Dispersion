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
  .controller('DashboardController', function ($scope, $q) {

    $scope.fileArray;
    $scope.files;

    $scope.init = function () {
      return $q(function (resolve, reject) {
        fs.readFile('data.json', 'utf-8', (err, data) => {
          var fileArray = []
          if (err) throw err;
          data = JSON.parse(data)
          let keyArray = Object.keys(data);
          keyArray.forEach(function (item) {
            fileArray.push({
              [item]: data[item]
            })
          })
          resolve(fileArray)
        })
      })
    }

    $scope.init().then(function (fileArray) {
      $scope.fileArray = fileArray;
      $scope.files = $scope.fileget();
    })

    $scope.fileget = function () {
      let arr = [];
      $scope.fileArray.forEach(function (item, index) {
        arr.push({
          item: item[Object.keys(item)].file,
          time: item[Object.keys(item)].time,
          url: item[Object.keys(item)].url
        })
      })
      return arr;
    }

    $scope.loadFile = function (index) {
      console.log(index)
      $(`#sel-option${index}`).show();
      
    }
  })

// http://jsfiddle.net/Tpf7E/22/