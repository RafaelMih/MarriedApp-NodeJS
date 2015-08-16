'use strict';

//Setting up route
angular.module('guests').config(['$stateProvider',
	function($stateProvider) {
		// Guests state routing
		$stateProvider.
		state('listGuests', {
			url: '/guests',
			templateUrl: 'modules/guests/views/list-guests.client.view.html'
		}).
		state('createGuest', {
			url: '/guests/create',
			templateUrl: 'modules/guests/views/create-guest.client.view.html'
		}).
		state('viewGuest', {
			url: '/guests/:guestId',
			templateUrl: 'modules/guests/views/view-guest.client.view.html'
		}).
		state('editGuest', {
			url: '/guests/:guestId/edit',
			templateUrl: 'modules/guests/views/edit-guest.client.view.html'
		});
	}
]);