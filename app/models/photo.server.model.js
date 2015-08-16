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
	name: {
		type: String,
		default: '',
		required: 'Please fill Photo name',
		trim: true
	},
	urlPhoto: {
		type: String,
		default: '',
		required: '',
		trim: true
	},
	order: {
		type: Number,
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