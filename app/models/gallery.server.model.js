'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gallery Schema
 */
var GallerySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Informe o nome da galeria',
		trim: true
	},
	order: {
		type: Number,
	},
	photosEnable: {
		type: Boolean,
		default: true
	},
	active: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	_creator: {
		type: Schema.ObjectId,
		ref: 'Admin'
	},
});

mongoose.model('Gallery', GallerySchema);