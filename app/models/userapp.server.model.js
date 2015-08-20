'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	validator = require('validator'),
	Schema = mongoose.Schema;

/**
 * E-mail validate
 */
var validateLocalStrategyEmail = function(property) {
	return validator.isEmail(this.email);
};

/**
 * Userapp Schema
 */
var UserappSchema = new Schema({	
	name: {
		type: String,
		trim: true,
		default: '',
		required: 'Informe o primeiro nome'
	},	
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyEmail, 'Email inválido'],
	},
	urlPhoto: {
		type: String,
		trim: true,
		default: ''
	},
	cellphone: {
		type: String,
		trim: true,
		default: '',
		unique: 'Número de celular já cadastrado',
		required: 'Infome o número do celular'
	},
	telephone: {
		type: String,
		trim: true,
		default: ''
	},
	isAdmin: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},
	_creator : {
		type : Schema.ObjectId, 
		ref : 'Admin'
	},
	_projects : [{
		type : Schema.ObjectId, 
		ref : 'Project'
	}]
});

mongoose.model('Userapp', UserappSchema);