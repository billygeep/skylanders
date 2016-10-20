'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.when('/view', {
    templateUrl: 'view/view.html'
  });
  $routeProvider.otherwise({redirectTo: '/view'});
}]);


function log(_msg) {
	console.log(_msg)
}