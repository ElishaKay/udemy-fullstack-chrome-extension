console.log('popup.js loaded');

let myAmazonHistory = angular.module("myamazonhistory", ['ui.router']);

myAmazonHistory.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '../views/home.html'
		})
		.state('login', {
			url: '/login',
			templateUrl: '../views/login.html'
		})

	$urlRouterProvider.otherwise('login')
})

myAmazonHistory.controller("PopupCtrl", ['$scope', '$state', function($scope, $state){
	console.log('PopupCtrl Initialized');

	$scope.login = function(formData){
		console.log('formData: ', formData);
	}
}])