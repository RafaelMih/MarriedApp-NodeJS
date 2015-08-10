'use strict';

//Setting up route
angular.module('testimonies').config(['$stateProvider',
	function($stateProvider) {
		// Testimonies state routing
		$stateProvider.
		state('listTestimonies', {
			url: '/testimonies',
			templateUrl: 'modules/testimonies/views/list-testimonies.client.view.html'
		}).
		state('createTestimony', {
			url: '/testimonies/create',
			templateUrl: 'modules/testimonies/views/create-testimony.client.view.html'
		}).
		state('viewTestimony', {
			url: '/testimonies/:testimonyId',
			templateUrl: 'modules/testimonies/views/view-testimony.client.view.html'
		}).
		state('editTestimony', {
			url: '/testimonies/:testimonyId/edit',
			templateUrl: 'modules/testimonies/views/edit-testimony.client.view.html'
		});
	}
]);