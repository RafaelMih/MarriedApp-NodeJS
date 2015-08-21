'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tokens = require('../../app/controllers/tokens.server.controller');

	// Tokens Routes
	app.route('/tokens')
		.post(tokens.create);
		
	// Finish by binding the Token middleware
	app.param('tokenId', tokens.tokenByID);
};
