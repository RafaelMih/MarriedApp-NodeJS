'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');

/**
 * Create a Photo
 */
exports.create = function(req, res) {
	var photo = new Photo(req.body);
	photo._creator = req.user;

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
	res.jsonp(req.photo);
};

/**
 * Update a Photo
 */
exports.update = function(req, res) {
	var photo = req.photo ;
	photo.updated = Date.now();

	photo = _.extend(photo , req.body);

	photo.save(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Delete an Photo
 */
exports.delete = function(req, res) {
	var photo = req.photo ;

	photo.remove(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * List of Photos
 */
exports.list = function(req, res) { 
	Photo.find()
	.sort('-created')
	.populate('_creator', 'name')
	.populate('_gallery')
	.populate('_project')
	.exec(function(err, photos) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(photos);
		}
	});
};

/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) { 
	Photo.findById(id)
	.populate('_creator', 'name')
	.populate('_gallery')
	.populate('_project')
	.exec(function(err, photo) {
		if (err) return next(err);
		if (! photo) return next(new Error('Failed to load Photo ' + id));
		req.photo = photo ;
		next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
