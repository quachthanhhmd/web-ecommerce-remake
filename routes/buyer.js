const express = require('express');
const { get } = require('mongoose');
const passport = require('passport');

var controllers = require('../controllers/buyer.controller');

var authorize = require("../middleware/auth");


const router = express.Router();


router.get('/login', controllers.getLogin);

router.post('/login', passport.authenticate("localSignin", {
        successRedirect: "/",
        failureRedirect: "/buyer/login",
        failureFlash: true
}));

router.post('/signup', passport.authenticate('localSignup', {
        successRedirect: '/buyer/login',
        failureRedirect: '/buyer/signup',
        failureFlash: true,
        successFlash: 'Sign Up Success. Please confirm your account via gmail!'
}));


router.get('/signup', controllers.getRegister);


router.get('/confirm/:token', controllers.confirm);


router.route('/forgot')
        .get(controllers.getForgot)
        .post(controllers.postForgot);

router.route('/resetPassword/:token')
        .get(controllers.getResetPassword)
        .post(controllers.postResetPassword);



router.route('/checkforgot/:token')
        .get(controllers.getCheckFogot)
        .post(controllers.forgot);


router.post('/checkSignup', controllers.checkSingup);


/* OAuth with passport */

router.get("/facebook", passport.authenticate('facebook', { scope: 'email' }));

router.get("/facebook/callback",
        controllers.getFacebookCallback
)

/* OAuth with google */
router.get("/google", passport.authenticate('google', { scope: 'email' }));

router.get("/google/callback",
        controllers.getGoogleCallback
);


module.exports = router;



