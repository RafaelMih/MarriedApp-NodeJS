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
		
		//error verify
		if (err){
			errorHandler.getError(res, err);
		}
		
		//Hash validate
		var isValidHash = Login.validateHash(login.phone, login.hash);		
		
		if (isValidHash){

			//Project validate
			Project.exists(login.projectId, function(err, exists){

				//error verify
				if (err){
					errorHandler.getError(res, err);
				}

				if (exists){

					//Get user id for register token
					UserApp.getByCellphone(login.phone, function(err, userId){

						//error verify
						if (err){
							errorHandler.getError(res, err);
						}

						if (userId){

							//User validate
							UserApp.existsInProject(userId, login.projectId, function(err, exists){

								if (exists){

									//error verify
									if (err){
										errorHandler.getError(res, err);
									}

									var token = new Token();

									token.userId = userId;
									token.projectId = login.projectId;									

									token.save(function(err, token){
										
										//error verify
										errorHandler.getError(res, err);

										return res.status(200).send({
											token: token._id
										});
									});
								}else{
									errorHandler.setError(res,'Usuário não pertence ao projeto');
								}
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
			errorHandler.setError(res,'Autenticação inválida');
		}		
	});
};


/**
 * List of Logins
 */
exports.list = function(req, res) { 
	Login.find().sort('-created').exec(function(err, logins) {
		if (err) {
			errorHandler.getError(err);
		} else {
			res.jsonp(logins);
		}
	});
};

exports.signup = function(req, res){
	var token = Token.getValidToken(req, res, function(err, token){
		if (err){
			errorHandler.getError(res, err);
		}else{
			console.log(token);
			UserApp.getByToken(token, function(err, user){
				if (err){
					errorHandler.getError(res, err);		
				}else{
					if(user){
						res.jsonp(user);
					}else{
						errorHandler.setError('Usuário não encontrado');
					}
				}
			});
		}
	});
};
