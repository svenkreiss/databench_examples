/* global Databench */
/* global angular */

const databench = new Databench.Connection();
Databench.ui.wire(databench);

angular.module('angularApp', [])
  .controller('navCtrl', ['$scope', '$location', ($scope, $location) => {
    $scope.navCheck = (page) => {
      const currentRoute = $location.path().substring(1) || 'home';
      return page === currentRoute;
    };
  }])
  .controller('testingAngular', ['$scope', ($scope) => {
    $scope.chapter = 'modify me';
  }])
  .controller('simplepi', ['$scope', ($scope) => {
    $scope.pi = '0.0 ± 1.0';

    databench.on({ data: 'pi' }, (pi) => {
      $scope.pi = `${pi.estimate.toFixed(3)} ± ${pi.uncertainty.toFixed(3)}`;
      $scope.$apply();
    });
  }]);

databench.connect();
