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
		.state('signup', {
			url: '/signup',
			templateUrl: '../views/signup.html'
		})
		
		

	$urlRouterProvider.otherwise('login')
})

myAmazonHistory.controller("PopupCtrl", ['$scope', '$state', function($scope, $state){
	console.log('PopupCtrl Initialized');

	$scope.login = function(formData){
		console.log('formData from Login: ', formData);
		chrome.runtime.sendMessage({type: "login", data: formData},
			function(response){
				console.log('response from the background is: ', response);
			} 
		)
	}

	$scope.signup = function(formData){
		console.log('formData from Signup: ', formData);
		chrome.runtime.sendMessage({type: "signup", data: formData},
			function(response){
				console.log('response from the background is: ', response);
			} 
		)
	}

}])