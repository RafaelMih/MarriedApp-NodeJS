'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	Admin = require('mongoose').model('Admin'),
	path = require('path'),
	config = require('./config');
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(admin, done) {
		done(null, admin.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		Admin.findOne({
			_id: id
		}, '-salt -password', function(err, admin) {
			done(err, admin);
		});
	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};