var passport = require('passport');
var passportHttp = require('passport-http');
var User = require('../models/user.js');
//var localStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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

passport.use('all', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : gConfig.jwtsecret
},
function (jwtPayload, cb) {
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findById(jwtPayload._id)
    .then(user => {          
        return cb(null, user);
    })
    .catch(err => {
        return cb(err);
    });
}
));

passport.use('global-admin', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : gConfig.jwtsecret
},
function (jwtPayload, cb) {
    //find the user in db if needed.
    return User.findOne({
        _id     : jwtPayload._id,
        role    : 'global_admin'
    }).then(user => {
        return cb(null, user);
    })
    .catch(err => {
        return cb(err);
    });
}
));