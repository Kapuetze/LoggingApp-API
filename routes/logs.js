var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user.js');
var Log = require('../models/log.js');

/* GET home page. */
router.post('/', 
passport.authenticate('basic', { session: false }),    
function(req, res, next) {

	// Creating one user.
	var log = new Log ({
		user: req.user,
		content: req.body.content,
		creationDate: Date.now()
	});

	console.log(log);
	// Saving it to the database.
	log.save(function(err, result){
		if (err) {
			res.json({ status: "error", message: err});
		} else {
			res.json({ status: "success", message: "Log saved successfully."});
		}
	});
});

/* GET home page. */
router.get('/', 
passport.authenticate('basic', { session: false }),    
function(req, res, next) {

	//console.log(req.user);
	Log.find({ user: req.user }, function (err, logs) {
		res.json(logs);
	});	
});

module.exports = router;
