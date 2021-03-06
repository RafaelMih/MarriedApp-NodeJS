'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Gallery = mongoose.model('Gallery'),
	_ = require('lodash');

/**
 * Create a Gallery
 */
exports.create = function(req, res) {
	var gallery = new Gallery(req.body);
	gallery._creator = req.user;

	gallery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gallery);
		}
	});
};

/**
 * Show the current Gallery
 */
exports.read = function(req, res) {
	res.jsonp(req.gallery);
};

/**
 * Update a Gallery
 */
exports.update = function(req, res) {
	var gallery = req.gallery ;
	gallery.updated = Date.now();

	gallery = _.extend(gallery , req.body);

	gallery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gallery);
		}
	});
};

/**
 * Delete an Gallery
 */
exports.delete = function(req, res) {
	var gallery = req.gallery ;

	gallery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gallery);
		}
	});
};

/**
 * List of Galleries
 */
exports.list = function(req, res) { 
	Gallery.find().sort('name')
	.populate('_creator', 'name')
	.exec(function(err, galleries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(galleries);
		}
	});
};

/**
 * Gallery middleware
 */
exports.galleryByID = function(req, res, next, id) { 
	Gallery.findById(id)
	.populate('_creator', 'name')
	.exec(function(err, gallery) {
		if (err) return next(err);
		if (! gallery) return next(new Error('Failed to load Gallery ' + id));
		req.gallery = gallery ;
		next();
	});
};

/**
 * Gallery authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
