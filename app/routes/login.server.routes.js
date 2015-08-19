'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var login = require('../../app/controllers/login.server.controller');

	// Login Routes
	app.route('/login')
		.get(login.login);

	//app.route('/signup')
		//.get(login.signup);
};
