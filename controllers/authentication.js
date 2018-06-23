const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser (user) {
	const timestamp = new Date().getTime();
	// sub: means who this token belong to
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// User has already their email and password auth'd
	// We just need to give them a token
	res.send({token: tokenForUser(req.user)});
}

exports.signup = function (req, res, next){
	console.log(req.body);
	const {email, password} = req.body;

	if(!email || !password) {
		return res.status(422).send({error: 'You must provide email and password'});
	} 

	// See if a user with the given email exists
	User.findOne({ email }, (err, existingUser) => {
		if(err) {return next(err);}

		// If a user with email does exist, return an error
		if(existingUser) {
			return res.status(422).send({error: 'Email is in use'});
		}

		// If a user with email doens't exist, create and save user record
		const user = new User({
			email, password
		});

		user.save((err) => {
			if(err) {return next(err);}

			// Respond to request indicationg the user was created
			res.json({token: tokenForUser(user)});
		});
	})
}