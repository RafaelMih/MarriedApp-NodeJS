'use strict';

//Userapps service used to communicate Userapps REST endpoints
angular.module('userapps').factory('Userapps', ['$resource',
	function($resource) {
		return $resource('userapps/:userappId', { userappId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);