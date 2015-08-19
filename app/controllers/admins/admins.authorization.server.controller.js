'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Admin = mongoose.model('Admin');


var messages = {
	AdminNotLoad : 'Administrador não encontrado.',
	AdminNotLogged : 'Administrador não está logado.',
	AdminNotAuthorized : 'Administrador não autorizado.'
};

/**
 * Admin middleware
 */
exports.adminByID = function(req, res, next, id) {
	Admin.findOne({
		_id: id
	}).exec(function(err, admin) {
		if (err) return next(err);
		if (!admin) return next(new Error(messages.AdminNotLoad + id));
		req.profile = admin;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: messages.AdminNotLogged
		});
	}

	next();
};

/**
 * Admin authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.admin.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: messages.AdminNotAuthorized
				});
			}
		});
	};
};