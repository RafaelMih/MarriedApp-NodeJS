'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Testimony = mongoose.model('Testimony'),
	_ = require('lodash');

/**
 * Create a Testimony
 */
exports.create = function(req, res) {
	var testimony = new Testimony(req.body);
	testimony.user = req.user;

	testimony.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimony);
		}
	});
};

/**
 * Show the current Testimony
 */
exports.read = function(req, res) {
	res.jsonp(req.testimony);
};

/**
 * Update a Testimony
 */
exports.update = function(req, res) {
	var testimony = req.testimony ;

	testimony = _.extend(testimony , req.body);

	testimony.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimony);
		}
	});
};

/**
 * Delete an Testimony
 */
exports.delete = function(req, res) {
	var testimony = req.testimony ;

	testimony.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimony);
		}
	});
};

/**
 * List of Testimonies
 */
exports.list = function(req, res) { 
	Testimony.find().sort('-created').populate('user', 'displayName').exec(function(err, testimonies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testimonies);
		}
	});
};

/**
 * Testimony middleware
 */
exports.testimonyByID = function(req, res, next, id) { 
	Testimony.findById(id).populate('user', 'displayName').exec(function(err, testimony) {
		if (err) return next(err);
		if (! testimony) return next(new Error('Failed to load Testimony ' + id));
		req.testimony = testimony ;
		next();
	});
};

/**
 * Testimony authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.testimony.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
