'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Guest = mongoose.model('Guest'),
	_ = require('lodash');

/**
 * Create a Guest
 */
exports.create = function(req, res) {
	var guest = new Guest(req.body);
	guest.user = req.user;

	guest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guest);
		}
	});
};

/**
 * Show the current Guest
 */
exports.read = function(req, res) {
	res.jsonp(req.guest);
};

/**
 * Update a Guest
 */
exports.update = function(req, res) {
	var guest = req.guest ;

	guest = _.extend(guest , req.body);

	guest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guest);
		}
	});
};

/**
 * Delete an Guest
 */
exports.delete = function(req, res) {
	var guest = req.guest ;

	guest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guest);
		}
	});
};

/**
 * List of Guests
 */
exports.list = function(req, res) { 
	Guest.find().sort('-created').populate('user', 'displayName').exec(function(err, guests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(guests);
		}
	});
};

/**
 * Guest middleware
 */
exports.guestByID = function(req, res, next, id) { 
	Guest.findById(id).populate('user', 'displayName').exec(function(err, guest) {
		if (err) return next(err);
		if (! guest) return next(new Error('Failed to load Guest ' + id));
		req.guest = guest ;
		next();
	});
};

/**
 * Guest authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.guest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
