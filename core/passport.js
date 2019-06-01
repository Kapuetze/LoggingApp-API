var passport = require('passport');
var passportHttp = require('passport-http');
var User = require('../models/user.js');
var localStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    //validation
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty().isLength({ min: 4 });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({'email': email}, function(err, user) {
        if (err) {
            return done(err);
        } 
        if(user) {
            return done(new Error("Email already in use"), false, { message: 'Email is already in use.' });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.creationDate = new Date();
        newUser.name = { first: null, last: null };

        newUser.save(function(err, result){
            if (err) {
                return done(err);
            } else {
                return done(null, newUser);
            }
        });
    });
}));

passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    //validation
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            debug.log(error.msg);
            messages.push(error.msg);
        });
        return done(messages, null);
    }

    //check user
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user || !user.validPassword(password)) {
            return done({ msg: 'Invalid credentials.' });
        }
        return done(null, user);
    });
}));

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