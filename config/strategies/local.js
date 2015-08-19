'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	Admin = mongoose.model('Admin'),
	sha256 = require('sha256'),
	config = require('../env/all');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			Admin.findOne({
			$or: [
	        	{ 'email' : username },
        		{ 'username': username }
        	],
			password: sha256(password + config.salt)
			}, function(err, admin) {
				if (err) {
					return done(err);
				}
				if (!admin) {
					return done(null, false, {
						message: 'Usuário/senha inválida.'
					});
				}
				if (!admin.authenticate(password)) {
					return done(null, false, {
						message: 'Usuário/senha inválida.'
					});
				}

				return done(null, admin);
			});
		}
	));
};