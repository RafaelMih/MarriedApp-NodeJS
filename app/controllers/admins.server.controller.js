'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Admin = mongoose.model('Admin'),
	_ = require('lodash');

/**
 * Extend admins's controller
 */
module.exports = _.extend(
	require('./admins/admins.authentication.server.controller'),
	require('./admins/admins.authorization.server.controller'),
	require('./admins/admins.profile.server.controller')
);