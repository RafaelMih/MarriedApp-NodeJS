'use strict';

// Testimonies controller
angular.module('testimonies').controller('TestimoniesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Testimonies',
	function($scope, $stateParams, $location, Authentication, Testimonies) {
		$scope.authentication = Authentication;

		// Create new Testimony
		$scope.create = function() {
			// Create new Testimony object
			var testimony = new Testimonies ({
				name: this.name
			});

			// Redirect after save
			testimony.$save(function(response) {
				$location.path('testimonies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Testimony
		$scope.remove = function(testimony) {
			if ( testimony ) { 
				testimony.$remove();

				for (var i in $scope.testimonies) {
					if ($scope.testimonies [i] === testimony) {
						$scope.testimonies.splice(i, 1);
					}
				}
			} else {
				$scope.testimony.$remove(function() {
					$location.path('testimonies');
				});
			}
		};

		// Update existing Testimony
		$scope.update = function() {
			var testimony = $scope.testimony;

			testimony.$update(function() {
				$location.path('testimonies/' + testimony._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Testimonies
		$scope.find = function() {
			$scope.testimonies = Testimonies.query();
		};

		// Find existing Testimony
		$scope.findOne = function() {
			$scope.testimony = Testimonies.get({ 
				testimonyId: $stateParams.testimonyId
			});
		};
	}
]);