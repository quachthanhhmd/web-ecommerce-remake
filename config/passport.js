// passport configuration
var User = require('../models/user.model');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

const {sendEmail} =  require('../config/nodemailer');
const cartController = require("../controllers/cart.controller");
const cartService = require("../models/cart.service")
const jwt =  require('jsonwebtoken');
const randomstring = require("randomstring");



const tokenLife = process.env.TOKEN_LIFE
const jwtKey = process.env.JWT_KEY

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id)
        .then(function(user) {
          done(null, user);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  
    passport.use(
      'localSignin',
      new LocalStrategy({ // or whatever you want to use
        usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
        passwordField: 'password',
        passReqToCallback: true 
      }, function(req, email, password, done) {
        User.findOne({ email: email }, async(err, user) =>{
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'Wrong username or password.'
            });
          }
  
          if (user.isVerify === false){
            return done(null, false, {
              message: 'Vui lòng check mail để xác thực'
          });
          }
          req.session.isVerify = true;

          bcrypt.compare(password, user.password, async(err, result) =>{
            if (err) {
              return done(err);
            }
            if (!result) {
              return done(null, false, {
                message: 'Wrong username or password.'
            });
            }
            console.log('acc : ' + user.email + ' ' + user.password + ' ' + password, result);

            await cartController.mergeCart(user._id, req.session.cart);

            const newCart = await cartService.findIdbyStatus(user._id, "waiting");
            req.session.cart = newCart;
     

            return done(null, user);
          });
        });
      })
    );


    passport.use(
      'localSignup',
      new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password', 
        passReqToCallback: true },  
        async(req, email, password, done) =>{
        console.log(email);
        User.findOne({ email: email },  async (err, user) => {
         
          if (err) {
            return done(err);
          }
          console.log(1212);
          if (user) {
            return done(null, false, {
              message: 'Tên đăng nhập đã tồn tại!'
            });
          }

          if (password.length <= 6) {
            return done(null, false, {
              message: 'Mật khẩu phải trên 6 ký tự!'
            });
          }
          
          if (password !== req.body.password2) {
            return done(null, false, {
              message: 'Hai mật khẩu không khớp!'
            });
          }

          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(String(req.body.email).toLowerCase())) {
            return done(null, false, {
              message: 'Địa chỉ email không hợp lệ!'
            });
          }
          
          const {name, email, passwords, phone} = req.body ; 
          let confirmPass = await randomstring.generate({
            length: 6
          });

          const passwordReset =  confirmPass;
          bcrypt.hash(password, bcrypt.genSaltSync(10)).then(hashPass => {
            const newUser = new User({
              name,
              email,
              password: hashPass,
              passwordReset,
              role: 'user',
              phone, 
            });
            // save the user
            newUser.save()
                  .then(async user => {
                      const token = jwt.sign( {_id: user._id}, jwtKey, {
                          expiresIn: 864000
                      })
                      

                      req.session.isVerify = false;

                      await sendEmail(req, user.email, token, 'confirmation');
                      
                      return done(null, newUser);
                  });
            
          });
        });
      })
    );
};