'use strict';

module.exports = function(app) {
	var admins = require('../../app/controllers/admins.server.controller');
	var login = require('../../app/controllers/login.server.controller');

	// Login Routes
	app.route('/login')
		.get(login.login);

	app.route(admins.hasAuthorization(['admin']), '/logins')
		.get(login.list);

	app.route('/signup')
		.get(login.signup);
};
