var express = require('express');
var passport = require('passport');
var router = express.Router();

var Model = require(gBase_dir + '/dal/models/models.module.js');
var DataContext = require(gBase_dir + '/dal/repos/datacontext.js');

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

    var container = await DataContext.Containers.findOne({ name: req.body.container});
    
    // Creating one log.
    var log = new Model.Log ({
        user: req.user._id,
        container: container._id,
        title: req.body.title,
        label: req.body.label,
        content: req.body.content,
        creationDate: Date.now()
    });

    // Saving it to the database.
    try{
        await DataContext.Logs.save(log);
        res.json({ status: "success", message: "Log saved successfully."});
    }catch (err) {
        res.json({ status: "error", message: err});
    }
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

/* SEARCH LOGS FOR ONE CONTAINER */
router.post('/search/:id', passport.authenticate(['basic', 'all'], {session: false}), async (req, res, next) => {
    try {
        query = req.body;
        
        //query["user"] = req.user;
        query["container"] = req.params.id;

        //get logs from database
        var logs = await Model.Log.find(query);

        //output the logs to the response
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the logs from the server." });
    }  
});

/* SEARCH LOGS FOR ONE CONTAINER */
router.get('/labels/:id', passport.authenticate(['basic', 'all'], {session: false}), async (req, res, next) => {
    try {
        query = {};
        //build query
        if(req.body !== null){
            query = req.body;
        }
        
        //query["user"] = req.user;
        query["container"] = req.params.id;

        //get logs from database
        var logs = await Model.Log.find(query);

        //output the logs to the response
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the logs from the server." });
    }  
});

/* RETURN POSSIBLE PROPERTIES FOR ONE CONTAINER */
router.get('/properties/:id', passport.authenticate(['basic', 'all'], {session: false}), async (req, res, next) => {
    try {
        query = {};
        //build query
        if(req.body !== null){
            query = req.body;
        }
        
        query["container"] = req.params.id;

        //get logs from database
        var logs = await Model.Log.find(query);

        var properties = getProperties(logs);

        //output the logs to the response
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the logs from the server." });
    }  
});

function getProperties(logs){
    var properties = new Array();
    logs.forEach(log => {
        properties = parseContentBody(log.toJSON(), new Array(), properties);
    });

    return properties;
}

function parseContentBody(content, keys, resultArray){

    var noParseProperties = ['_id', 'id'];
    var ignoreProperties = ['__v','_bsontype'];

    if (content){
        Object.keys(content).forEach(function (key, index) {

            if (!ignoreProperties.includes(key)) {
                keys.push(key);
                if (typeof content[key] == 'object' && !noParseProperties.includes(key)) {
                    //console.log(key);
                    
                    parseContentBody(content[key], keys, resultArray);
                }
                else {
                    //console.log("keys: " + keys);
                    var keyString = keys.join(".");
                    if (!resultArray.includes(keyString)) {
                        resultArray.push(keyString);
                    }
                }
                keys.pop();
            }
        });
    }

    return resultArray;
}

module.exports = router;
