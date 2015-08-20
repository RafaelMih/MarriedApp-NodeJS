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
	_projects : [String]
});

/**
 * Verify if exists
 */
UserappSchema.statics.exists = function(cellphone, projectId, callback) {
  this.model('Userapp')
  	.find({ cellphone: cellphone, _projects: { $in: [projectId] }}).count()
  	.exec(function(err, count) {	
		callback(err, count > 0);
	});
};

/**
 * Get UserApp by cellphone
 */
UserappSchema.statics.getByCellphone = function(cellphone, callback) {
  this.model('Userapp')
  	.findOne({ cellphone: cellphone}, { '_id': 1 })
  	.exec(function(err, userApp) {
  		if (userApp){
			callback(err, userApp._id);
		}
	});
};

mongoose.model('Userapp', UserappSchema);