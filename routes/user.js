var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require('passport');

var Model = require(gBase_dir + '/dal/models/models.module.js');
var DataContext = require(gBase_dir + '/dal/repos/datacontext.js');

/* GET users listing. */
router.post('/register', function(req, res, next) {
    passport.authenticate('local.signup', function(err, user) {
        if (err) { 
            res.json(err);
        }
        if (user) { 
            user.password = "";
            const token = jwt.sign(JSON.parse(JSON.stringify(user)), gConfig.jwtsecret);
            return res.json({ user, token }); 
        }       
    })(req, res, next);
});

    
/* POST Attempt sign in */
router.post('/login', function(req, res, next) {
    passport.authenticate('local.signin', function(err, user) {
        if (err) { 
            res.json(err);
        }
        if (user) { 
            user.password = "";
            const token = jwt.sign(JSON.parse(JSON.stringify(user)), gConfig.jwtsecret);
            return res.json({ user, token, expiration: 100000 }); 
        }       
    })(req, res, next);
});

/* GET logout. */
router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('signin');
});

/* GET profile page. */
router.get('/profile', function (req, res, next) {
    return res.json(req.user);
});

/* GET all users */
router.get('/all', passport.authenticate('global-admin', {session: false}), async (req, res, next) => {

    var users = await DataContext.Users.find({}, { password: 0 });
    
    res.json(users);
});

/* DELETE one user */
router.delete('/:id', async (req, res, next) => {
    var message;

    try {
        await DataContext.Users.findByIdAndRemove(req.params.id);
        message = "Success";
    } catch (error) {
        message = "Error";
    }  

    res.status(200).json(message);  
});

/* GET one user */
router.get('/:id', passport.authenticate('all', {session: false}), async (req, res, next) => {
    try {
        var user = await DataContext.Users.findById(req.params.id, { password: 0 });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching the user" });
    }  
});

/* UPDATE the user */
router.patch('/:id', async (req, res, next) => {
    var message;
    
    try {
        //load old product
        var user = await DataContext.Users.findById(req.params.id);

        //apply new values
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;

        //Save new category
        await DataContext.Users.save(user);

        message = "success";
    } catch (error) {

        message = "error";
    }

    res.status(200).json(message);
});
module.exports = router;
