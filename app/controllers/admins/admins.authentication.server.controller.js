'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Admin = mongoose.model('Admin');


/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, admin, info) {
		if (err || !admin) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			admin.password = undefined;
			admin.salt = undefined;

			req.login(admin, function(err) {

				if (err) {
					res.status(400).send(err);
				} else {
					res.json(admin);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, admin, redirectURL) {
			if (err || !admin) {
				return res.redirect('/#!/signin');
			}
			req.login(admin, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth admin profile
 */
exports.saveOAuthAdminProfile = function(req, providerAdminProfile, done) {
	if (!req.admin) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerAdminProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerAdminProfile.provider + '.' + providerAdminProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerAdminProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerAdminProfile.providerData[providerAdminProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerAdminProfile.providerData[providerAdminProfile.providerIdentifierField];

		// Define a search query to find existing admin with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		Admin.findOne(searchQuery, function(err, admin) {
			if (err) {
				return done(err);
			} else {
				if (!admin) {
					var possibleAdminname = providerAdminProfile.adminname || ((providerAdminProfile.email) ? providerAdminProfile.email.split('@')[0] : '');

					Admin.findUniqueAdminname(possibleAdminname, null, function(availableAdminname) {
						admin = new Admin({
							firstName: providerAdminProfile.firstName,
							lastName: providerAdminProfile.lastName,
							adminname: availableAdminname,
							displayName: providerAdminProfile.displayName,
							email: providerAdminProfile.email,
							provider: providerAdminProfile.provider,
							providerData: providerAdminProfile.providerData
						});

						// And save the admin
						admin.save(function(err) {
							return done(err, admin);
						});
					});
				} else {
					return done(err, admin);
				}
			}
		});
	} else {
		// Admin is already logged in, join the provider data to the existing admin
		var admin = req.admin;

		// Check if admin exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (admin.provider !== providerAdminProfile.provider && (!admin.additionalProvidersData || !admin.additionalProvidersData[providerAdminProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!admin.additionalProvidersData) admin.additionalProvidersData = {};
			admin.additionalProvidersData[providerAdminProfile.provider] = providerAdminProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			admin.markModified('additionalProvidersData');

			// And save the admin
			admin.save(function(err) {
				return done(err, admin, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('Admin is already connected using this provider'), admin);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var admin = req.admin;
	var provider = req.param('provider');

	if (admin && provider) {
		// Delete the additional provider
		if (admin.additionalProvidersData[provider]) {
			delete admin.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			admin.markModified('additionalProvidersData');
		}

		admin.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(admin, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(admin);
					}
				});
			}
		});
	}
};