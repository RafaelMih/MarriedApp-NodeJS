'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var PhotoSchema = new Schema({
	description: {
		type: String, 
		max: 100,
		default: '',
		trim: true
	},
	urlPhoto: {
		type: String,
		max: 200,
		default: '',
		required: 'Informe o endereço da foto',
		trim: true
	},
	order: {
		type: Number,
		max: 3,
		default: ''
	},
	active: {
		type: Boolean,
		default: true,
	},
	photosEnable: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	gallery: {
		type: Schema.ObjectId,
		ref: 'Gallery'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Photo', PhotoSchema);