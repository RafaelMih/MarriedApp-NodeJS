'use strict';

// Configuring the Articles module
angular.module('guests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Guests', 'guests', 'dropdown', '/guests(/create)?');
		Menus.addSubMenuItem('topbar', 'guests', 'List Guests', 'guests');
		Menus.addSubMenuItem('topbar', 'guests', 'New Guest', 'guests/create');
	}
]);