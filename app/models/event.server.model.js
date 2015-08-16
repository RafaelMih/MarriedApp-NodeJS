'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Informe o nome do evento',
		trim: true
	},
	type: {
		type: [{
			type: String,
			enum: ['Buffet', 'Cerimony']
		}],
		default: ['Buffet']
	},
	dateStart: {
		type: Date,
		default: '',
		required: 'Informe a data e hora inicial do evento'
	},
	dateEnd: {
		type: Date,
		default: '',
		required: 'Informe a data e hora final do evento'
	},
	created: {
		type: Date,
		default: Date.now
	},
	address: {
		type: Schema.ObjectId,
		ref: 'Address'
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Event', EventSchema);