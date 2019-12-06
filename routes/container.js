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
    if (!req.body.name) {
        res.status(400).json({ status: "error", message: "Please provide a container name."});
        return;
    }

    //check if the container name already exists
    var containerCheck = await DataContext.Containers.findOne({ name: req.body.name});
    if (containerCheck != null) {
        res.status(200).json({ status: "error", message: `A container with name '${req.body.name}' already exists.`});
        return;
    }

    // Creating one log.
    var container = new Model.Container ({
        user: req.user._id,
        users: [req.user],
        name: req.body.name,
        creationDate: Date.now()
    });

    // Saving it to the database.
    try{
        await DataContext.Containers.save(container);
        res.json({ status: "success", message: "Container saved successfully."});
    }catch (err) {
        res.json({ status: "error", message: err});
    }
});

/* SEARCH LOGS */
router.get('/', passport.authenticate(['basic', 'all'], {session: false}), async (req, res, next) => {
    try {
        //get logs from database
        var containers = await DataContext.Containers.find({ user: req.user._id });

        //output the logs to the response
        res.json(containers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the containers from the server." });
    }  
});

module.exports = router;
