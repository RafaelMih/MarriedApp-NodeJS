'use strict';

// Guests controller
angular.module('guests').controller('GuestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Guests',
	function($scope, $stateParams, $location, Authentication, Guests) {
		$scope.authentication = Authentication;

		// Create new Guest
		$scope.create = function() {
			// Create new Guest object
			var guest = new Guests ({
				name: this.name
			});

			// Redirect after save
			guest.$save(function(response) {
				$location.path('guests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Guest
		$scope.remove = function(guest) {
			if ( guest ) { 
				guest.$remove();

				for (var i in $scope.guests) {
					if ($scope.guests [i] === guest) {
						$scope.guests.splice(i, 1);
					}
				}
			} else {
				$scope.guest.$remove(function() {
					$location.path('guests');
				});
			}
		};

		// Update existing Guest
		$scope.update = function() {
			var guest = $scope.guest;

			guest.$update(function() {
				$location.path('guests/' + guest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Guests
		$scope.find = function() {
			$scope.guests = Guests.query();
		};

		// Find existing Guest
		$scope.findOne = function() {
			$scope.guest = Guests.get({ 
				guestId: $stateParams.guestId
			});
		};
	}
]);