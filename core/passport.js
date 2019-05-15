var passport = require('passport');
var passportHttp = require('passport-http');
var User = require('../models/user.js');

passport.use(new passportHttp.BasicStrategy(
	function(username, password, done) {
		User.findOne({ email: username }, function (err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.validPassword(password)) { return done(null, false); }
			return done(null, user);
		});
	}
));