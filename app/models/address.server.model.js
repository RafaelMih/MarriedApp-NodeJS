'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Address Schema
 */
var AddressSchema = new Schema({
	street: {
		type: String,
		default: '',
		required: 'Informe o nome da rua ou avenida',
		trim: true
	},
	suburb: {
		type: String,
		default: '',
		required: 'Informe o nome do bairro',
		trim: true
	},
	number:{
		type: Number,
		default: '',
		required: 'Informe o número',
		trim: true
	},
	complement:{
		type: String,
		trim: true
	},
	city:{
		type: String,
		default: '',
		required: 'Informe a cidade',
		trim: true
	},
	zipcode:{
		type: String,
		default: '',
		required: 'Informe o CEP',
		trim: true
	},
	country:{
		type: String,
		default: '',
		required: 'Informe o nome do país',
		trim: true
	},
	location: {
		type: [Number],
    	index: '2d',
    	required: 'Informe a coordenada do endereço'
	}
});

mongoose.model('Address', AddressSchema);
