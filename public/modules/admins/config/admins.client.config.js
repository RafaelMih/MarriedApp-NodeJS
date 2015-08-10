'use strict';

// Configuring the Articles module
angular.module('admins').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admins', 'admins', 'dropdown', '/admins(/create)?', false);
		Menus.addSubMenuItem('topbar', 'admins', 'Novo Administrador', 'admins/create', false, 'admin');
		Menus.addSubMenuItem('topbar', 'admins', 'Lista de Administradores', 'admins', false, 'admin');		
	}
]);