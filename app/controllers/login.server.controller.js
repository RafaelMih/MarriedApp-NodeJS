'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	url = require('url'),
	errorHandler = require('./errors.server.controller'),
	coreHandler = require('./core.server.controller'),
	UserApp = mongoose.model('Userapp'),
	Project = mongoose.model('Project'),
	Token = mongoose.model('Token'),
	Login = mongoose.model('Login');



/**
 * Login
 */
exports.login = function(req, res, next) {
	
	var login = new Login(url.parse(req.url,true).query);	

	login.ip = coreHandler.getIP(req);

	login.save(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {

			//Hash validate
			var isValidHash = Login.validateHash(login.phone, login.hash);		
			
			if (isValidHash){

				//Project validate
				Project.exists(login.projectId, function(err, exists){					
					if (exists){
						
						//User validate
						UserApp.exists(login.phone, login.projectId, function(err, exists){
							if (exists){
								
								//Get user id for register token
								UserApp.getByCellphone(login.phone, function(err, userAppId){
									
									var token = new Token();

									token.userId = userAppId;
									token.projectId = login.projectId;									

									token.save(function(err, token){
										if (err) errorHandler.getError(res, err);

										return res.status(200).send({
											token: token._id
										});
									});
								});
							}else{
								errorHandler.setError(res,'Usuário inválido');
							}
						});
					}
					else{
						errorHandler.setError(res,'Projeto inválido');
					}
				});
			}else{
				errorHandler.setError(res,'Hash inválido');
			}
		}
	});
};

/**
 * Signup
 */
exports.login = function(req, res, next) {

};



/**
 * List of Logins
 */
exports.list = function(req, res) { 
	Login.find().sort('-created').exec(function(err, logins) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logins);
		}
	});
};

