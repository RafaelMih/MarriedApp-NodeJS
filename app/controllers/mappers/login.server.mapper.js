'use strict';

/**
 * Mapper login object
 */
exports.User = function(user) {
	var outUser = {
		id : user._id,
		name : user.firstName + ' ' + user.lastName,
		type : user.roles[0],
		login : user.username,
		email : user.email
	};

	return outUser;
};