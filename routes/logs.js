var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Log = require('../models/log.js');

/* GET home page. */
router.get('/', function(req, res, next) {

    // Creating one user.
    var log = new Log ({
      user: "5cd9bb3d12333e14388252b0",
      content: {
        myprop: "test",
        date: Date.now()
      },
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

module.exports = router;
