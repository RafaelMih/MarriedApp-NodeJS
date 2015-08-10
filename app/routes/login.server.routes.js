'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var login = require('../../app/controllers/login.server.controller');

	// Admins Routes
	app.route('/login')
		.get(login.list)
		.post(login.login);
};
