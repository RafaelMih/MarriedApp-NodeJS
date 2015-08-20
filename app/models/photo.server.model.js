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
	_project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	_gallery: {
		type: Schema.ObjectId,
		ref: 'Gallery'
	},
	_creator: {
		type: Schema.ObjectId,
		ref: 'Admin'
	}
});

mongoose.model('Photo', PhotoSchema);