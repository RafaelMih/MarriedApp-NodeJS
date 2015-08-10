'use strict';

//Testimonies service used to communicate Testimonies REST endpoints
angular.module('testimonies').factory('Testimonies', ['$resource',
	function($resource) {
		return $resource('testimonies/:testimonyId', { testimonyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);