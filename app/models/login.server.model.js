'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	validator = require('validator'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var validateLength = {
	login : {
		min : 5,
		max : 100
	},
	password : {
		min : 64,
		max : 64
	}
};

var messages = {
	login: 'Informe o login',
	password: 'Informe a senha',
	ip: 'IP não informado',
	validate : {
		login: 'O login deve ter de '+ validateLength.login.min + ' à '+ validateLength.login.max + ' caracteres',
		password: 'A senha deve ter '+ validateLength.password.min + ' caracteres'
	}
};

var validateLocalStrategyLogin = function(property) {
	return validator.isLength(this.login, validateLength.login.min, validateLength.login.max);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(property) {
	return validator.isLength(this.password, validateLength.password.min, validateLength.password.max);
};


/**
 * Login Schema
 */
var LoginSchema = new Schema({
	login: {
		type: String,
		default: '',
		required: messages.login,
		trim: true,
		validate: [validateLocalStrategyLogin, messages.validate.email]
	},
	password: {
		type: String,
		default: '',
		required: messages.password,
		trim: true,
		validate: [validateLocalStrategyPassword, messages.validate.password]
	},
	ip :{
		type: String,
		default: '',
		required: messages.ip
	},
	created: {
		type: Date,
		default: Date.now
	}
});


/**
 * Hook a pre save method to hash the password
 */
LoginSchema.pre('save', function(next) {
	this.password = this.hashPassword(this.password);
	next();
});

/**
 * Create instance method for hashing a password
 */
LoginSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 4096, 32).toString('hex');
	} else {
		return password;
	}
};

mongoose.model('Login', LoginSchema);