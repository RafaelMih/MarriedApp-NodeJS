'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	validator = require('validator'),
	sha256 = require('sha256'),
	config = require('../../config/env/all'),
	Schema = mongoose.Schema;

/**
 * E-mail validate
 */
var validateLocalStrategyEmail = function(property) {
	return validator.isEmail(this.email);
};


/**
 * Admin Schema
 */
var AdminSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Informe o nome',
		trim: true
	},
	username: {
		type: String,
		default: '',
		required: 'Informe o usuário',
		unique: 'Login já cadastrado',
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Informe o email',
		unique: 'Email já cadastrado',
		validate: [validateLocalStrategyEmail, 'Informe um email válido'],
		trim: true
	},
	password: {
		type: String,
		default: '',
		required: 'Informe a senha',
		trim: true
	},
	_creator: {
		type: Schema.ObjectId,
		ref: 'Admin'
	},
	roles: {
		type: [{
			type: String,
			enum: ['admin']
		}],
		default: ['admin']
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
AdminSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = config.salt;
		this.password = this.hashPassword(this.password);
	}

	next();
});

 /**
 * Create instance method for authenticating admin
 */
AdminSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};


/**
 * Create instance method for hashing a password
 */
AdminSchema.methods.hashPassword = function(password) {
	if (password) {
		return sha256(password + config.salt);
	} else {
		return password;
	}
};

mongoose.model('Admin', AdminSchema);