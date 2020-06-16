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
		.state('welcome', {
			url: '/welcome',
			templateUrl: '../views/welcome.html'
		})
		.state('search-options', {
			url: '/search-options',
			templateUrl: '../views/search-options.html'
		})
		
		

	$urlRouterProvider.otherwise('login')
})

myAmazonHistory.controller("PopupCtrl", ['$scope', '$state', function($scope, $state){
	console.log('PopupCtrl Initialized');

	$scope.onPopupInit = function() {
        console.log('ran $scope.onPopupInit function');
        chrome.runtime.sendMessage({type:"onPopupInit"}, 
            function(response){
                console.log('this is the response from the background page for onPopupInit message',response);
                if(response.user){
                    $scope.name = response.user.name;
                    $state.go('welcome');
                }       
            }
        );
    };

    $scope.onPopupInit();

	$scope.login = function(formData){
		console.log('formData from Login: ', formData);
		chrome.runtime.sendMessage({type: "login", data: formData},
			function(response){
				console.log('response from the background is: ', response);
				if(response.user){
					$scope.name = response.user.username; 
					$state.go('welcome');	
				}
				
			} 
		)
	}

	$scope.signup = function(formData){
		console.log('formData from Signup: ', formData);
		chrome.runtime.sendMessage({type: "signup", data: formData},
			function(response){
				console.log('response from the background is: ', response);
				if(response.token){
					$state.go('login');
				}
			} 
		)
	}

}]);


myAmazonHistory.controller("ScraperCtrl", ['$scope', '$state', function($scope, $state){
	console.log('ScraperCtrl Initialized');

	 //scrape purchase history result
    $scope.fetchMyHistory = function(user){
        chrome.runtime.sendMessage({type:"initiateHistoryScraping", user: user }, 
            function(response){
                console.log('this is the response from the content page for initiateHistoryScraping Event',response);
                if(response.error){
                    let theErrorMessage = response.data.responseJSON.error;
                    console.log('theErrorMessage:',theErrorMessage);
                    $scope.errorMessage = theErrorMessage;
                    $scope.error = true;  
                }
            }
        ); 
    }

    $scope.showSearchOptions = function(){
    	$state.go('search-options');
    }

     //scrape search results
    $scope.initiateSearchScraping = function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log('tabs', tabs);
            chrome.runtime.sendMessage({type:"initiateSearchScraping", search_url: tabs[0].url }, 
                function(response){
                    console.log('this is the response from the content page for the initiateSearchScraping Event',response); 
                    if(response.error){
                        let theErrorMessage = response.data.responseJSON.error;
                        console.log('theErrorMessage:',theErrorMessage);
                        $scope.errorMessage = theErrorMessage;
                        $scope.error = true;  
                    } else {
                         $state.go('home.dance-time');
                    }
                }
            ); 
        });  
    }

    $scope.initiateSearchKeywordsScraping = function(search_keywords){
        console.log('search_keywords: ',search_keywords)
        chrome.runtime.sendMessage({type:"initiateSearchKeywordsScraping", search_keywords: search_keywords }, 
            function(response){
                console.log('this is the response from the content page for the initiateSearchKeywordsScraping Event',response); 
                if(response.error){
                    let theErrorMessage = response.data.responseJSON.error;
                    console.log('theErrorMessage:',theErrorMessage);
                    $scope.errorMessage = theErrorMessage;
                    $scope.error = true;  
                } else {
                     $state.go('home.dance-time');
                }
            }
        );   
    }

}]);