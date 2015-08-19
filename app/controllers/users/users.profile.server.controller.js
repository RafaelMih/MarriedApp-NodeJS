'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mapper = require('../mappers/login.server.mapper.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');


var messages = {
	error : {
		UserNotSignedIn : 'Usuário não informado',
		UserNotLoad : 'Usuário não encontrado'
	}
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: messages.error.UserNotSignedIn
		});
	}
};

exports.all = function (req, res) {
	User.find().sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(users);
		}
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Get User by Login
 */
exports.getUserByLogin = function(res, login, next){
	console.log('login === ' + login);
	User.findOne({
		$or: [
        	{ 'email' : login.login },
        	{ 'username' : login.login }
        ],
		password: login.password
	}).exec(function(err, user) {		
		if (err) return next(errorHandler.getError(res, err));
		if (!user) return res.status(400).send({message: messages.error.UserNotLoad});
		user = mapper.User(user);
		return res.json(user);
	});
};