'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
	var output;

	try {
		var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

	} catch (ex) {
		output = 'Unique field already exists';
	}

	return output;
};

var getErrorMessages = function(err) {	
	
	var messages = [];

	console.log(err);

	if (err.message){
		messages.push(err.message);
	}
	
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				messages.push(getUniqueErrorMessage(err));
				break;
			default:
				messages.push('Erro inesperado.');
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) messages.push(err.errors[errName].message);
		}
	}

	return messages;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
	getErrorMessages(err);
};

/**
 * Get the error message from error object
 */
exports.getError = function(res, err) {
	if (err){
		return res.status(400).send({
			message: getErrorMessages(err)
		});
	}
};

/**
 * 
 */
exports.setError = function(res, err) {
	return res.status(400).send({
		message: err
	});
};

