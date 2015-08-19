'use strict';

// Configuring the Articles module
angular.module('userapps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Usuários', 'userapps', 'dropdown', '/userapps(/create)?');
		Menus.addSubMenuItem('topbar', 'userapps', 'Lista de usuários', 'userapps');
		Menus.addSubMenuItem('topbar', 'userapps', 'Novo usuário', 'userapps/create');
	}
]);