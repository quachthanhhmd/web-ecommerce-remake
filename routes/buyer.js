const express = require('express');
const { get } = require('mongoose');
const passport = require('passport');

const controllers = require('../controllers/buyer.controller');

const authorize = require("../middleware/auth");


const router = express.Router();


router.get('/login', authorize.CheckNotAuth, controllers.getLogin);

router.post('/login', authorize.CheckNotAuth, controllers.postLogin);

router.post('/signup', passport.authenticate('localSignup', {
        successRedirect: '/buyer/login',
        failureRedirect: '/buyer/signup',
        failureFlash: true,
        successFlash: 'Sign Up Success. Please confirm your account via gmail!'
}));


router.get('/signup', authorize.CheckNotAuth, controllers.getRegister);


router.get('/confirm/:token', authorize.CheckNotAuth, controllers.confirm);


router.route('/forgot')
        .get(authorize.CheckNotAuth, controllers.getForgot)
        .post(authorize.CheckNotAuth, controllers.postForgot);

router.route('/resetPassword/:token')
        .get(authorize.CheckNotAuth, controllers.getResetPassword)
        .post(authorize.CheckNotAuth, controllers.postResetPassword);



router.route('/checkforgot/:token')
        .get(authorize.CheckNotAuth, controllers.getCheckFogot)
        .post(authorize.CheckNotAuth, controllers.forgot);


router.post('/checkSignup', authorize.CheckNotAuth, controllers.checkSingup);


/* OAuth with passport */

router.get("/facebook", authorize.CheckNotAuth, passport.authenticate('facebook', { scope: 'email' }));

router.get("/facebook/callback", authorize.CheckNotAuth,
        controllers.getFacebookCallback
)

/* OAuth with google */
router.get("/google", authorize.CheckNotAuth, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback", authorize.CheckNotAuth,
        controllers.getGoogleCallback
);


module.exports = router;



