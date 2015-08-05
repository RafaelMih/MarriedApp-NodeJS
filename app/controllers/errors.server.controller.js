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

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
	
	var messages = [];

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