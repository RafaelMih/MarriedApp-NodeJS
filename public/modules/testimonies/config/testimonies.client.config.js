'use strict';

// Configuring the Articles module
angular.module('testimonies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Testimonies', 'testimonies', 'dropdown', '/testimonies(/create)?');
		Menus.addSubMenuItem('topbar', 'testimonies', 'List Testimonies', 'testimonies');
		Menus.addSubMenuItem('topbar', 'testimonies', 'New Testimony', 'testimonies/create');
	}
]);