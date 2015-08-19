'use strict';

// Userapps controller
angular.module('userapps').controller('UserappsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Userapps',
	function($scope, $stateParams, $location, Authentication, Userapps) {
		$scope.authentication = Authentication;

		// Create new Userapp
		$scope.create = function() {
			// Create new Userapp object
			var userapp = new Userapps ({
				name: this.name
			});

			// Redirect after save
			userapp.$save(function(response) {
				$location.path('userapps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Userapp
		$scope.remove = function(userapp) {
			if ( userapp ) { 
				userapp.$remove();

				for (var i in $scope.userapps) {
					if ($scope.userapps [i] === userapp) {
						$scope.userapps.splice(i, 1);
					}
				}
			} else {
				$scope.userapp.$remove(function() {
					$location.path('userapps');
				});
			}
		};

		// Update existing Userapp
		$scope.update = function() {
			var userapp = $scope.userapp;

			userapp.$update(function() {
				$location.path('userapps/' + userapp._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Userapps
		$scope.find = function() {
			$scope.userapps = Userapps.query();
		};

		// Find existing Userapp
		$scope.findOne = function() {
			$scope.userapp = Userapps.get({ 
				userappId: $stateParams.userappId
			});
		};
	}
]);