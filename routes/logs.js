var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require(gBase_dir + '/dal/models/user.js');
var Log = require(gBase_dir + '/dal/models/log.js');
var Container = require(gBase_dir + '/dal/models/container.js');

/* CREATE a new log entry. */
router.post('/', 
passport.authenticate(['basic', 'all'], { session: false }), 
async (req, res, next) => {

    //validate the container name
    if (!req.body.container) {
        res.status(400).json({ status: "error", message: "Please provide the id of a valid container."});
        return;
    }

    //only add log if it has contents
    if (!req.body.content) {
        res.status(400).json({ status: "error", message: "Please provide a content body."});
        return;
    }

    var container = await Container.findOne({ name: req.body.container});
    
    // Creating one log.
    var log = new Log ({
        user: req.user._id,
        container: container._id,
        title: req.body.title,
        label: req.body.label,
        content: req.body.content,
        creationDate: Date.now()
    });

    // Saving it to the database.
    log.save(function(err, result){
        if (err) {
            res.json({ status: "error", message: err});
        } else {
            res.json({ status: "success", message: "Log saved successfully."});
        }
    });
});

/* GET all logs. */
// router.get('/', 
// passport.authenticate(['basic', 'all'], { session: false }),    
// function(req, res, next) {

// 	//console.log(req.user);
// 	Log.find({ user: req.user }, function (err, logs) {
//         if(err){
//             res.json({ status: "error", message: err});
//         }else{
//             res.json(logs);
//         }
// 	});	
// });

/* SEARCH LOGS */
router.post('/search', passport.authenticate(['basic', 'all'], {session: false}), async (req, res, next) => {
    try {
        query = {};
        //build query
        if(req.body !== null){
            query = req.body;
        }
        query["user"] = req.user;

        //get logs from database
        var logs = await Log.find(query);

        //output the logs to the response
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the logs from the server." });
    }  
});

module.exports = router;
