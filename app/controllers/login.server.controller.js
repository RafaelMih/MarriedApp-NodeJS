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
		errorHandler.getError(res, err);
		
		console.log('Validando hash...');

		//Hash validate
		var isValidHash = Login.validateHash(login.phone, login.hash);		
		
		if (isValidHash){

			console.log('Hash ok');
			console.log('Validando projeto...');

			//Project validate
			Project.exists(login.projectId, function(err, exists){

				//error verify
				errorHandler.getError(res, err);

				if (exists){

					console.log('Projeto ok');
					console.log('Validando usuário...');
					
					//Get user id for register token
					UserApp.getByCellphone(login.phone, function(err, userId){

						console.log('Verificando usuário...111111111111');

						//error verify
						errorHandler.getError(res, err);

						console.log('Verificando usuário...');

						if (userId){

							//User validate
							UserApp.existsInProject(userId, login.projectId, function(err, exists){

								if (exists){

									//error verify
									errorHandler.getError(res, err);

									console.log('Usuário OK');
									
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
	var token = Token.getValidToken(req, res, function(err, user){
		if (err){
			errorHandler.getError(res, err);
		}else{
			res.jsonp(user);
		}
	});
};
