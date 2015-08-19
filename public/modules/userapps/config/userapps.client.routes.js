'use strict';

//Setting up route
angular.module('userapps').config(['$stateProvider',
	function($stateProvider) {
		// Userapps state routing
		$stateProvider.
		state('listUserapps', {
			url: '/userapps',
			templateUrl: 'modules/userapps/views/list-userapps.client.view.html'
		}).
		state('createUserapp', {
			url: '/userapps/create',
			templateUrl: 'modules/userapps/views/create-userapp.client.view.html'
		}).
		state('viewUserapp', {
			url: '/userapps/:userappId',
			templateUrl: 'modules/userapps/views/view-userapp.client.view.html'
		}).
		state('editUserapp', {
			url: '/userapps/:userappId/edit',
			templateUrl: 'modules/userapps/views/edit-userapp.client.view.html'
		});
	}
]);