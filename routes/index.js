var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {

    // // Creating one user.
    // var user = new User ({
    //   name: { first: 'Jonas', last: 'Berger' },
    //   email: 'jonas@test.com',
    //   role : 'admin',
    //   creationDate: Date.now()
    // });
    // user.password = user.encryptPassword('jonastest');

    // console.log(user.password);
    // // Saving it to the database.
    // user.save(function(err, result){
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log("Success")
    //   }
    // });
});

module.exports = router;
