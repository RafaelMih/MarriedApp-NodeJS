'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	coreHandler = require('./core.server.controller'),
	UserProfile = require('./users/users.profile.server.controller'),
	Login = mongoose.model('Login');

/**
 * Login
 */
exports.login = function(req, res, next) {
	var login = new Login(req.body);
	login.ip = coreHandler.getIP(req);

	login.save(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {			
			return UserProfile.getUserByLogin(res, login, next);
		}
	});
};


/**
 * List of Logins
 */
exports.list = function(req, res) { 
	Login.find().sort('-created').exec(function(err, logins) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logins);
		}
	});
};