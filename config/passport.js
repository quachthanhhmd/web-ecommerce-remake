
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport configuration
var User = require('../models/user.model');


const { sendEmail } = require('../config/nodemailer');
const cartController = require("../controllers/cart.controller");
const cartService = require("../services/cart.service")




const tokenLife = process.env.TOKEN_LIFE
const jwtKey = process.env.JWT_KEY
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET
const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then(function (user) {
        done(null, user);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  passport.use(
    'localSignin',
    new LocalStrategy({ // or whatever you want to use
      usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
      passwordField: 'password',
      passReqToCallback: true
    }, function (req, email, password, done) {
      User.findOne({ email: email }, async (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Wrong username or password.'
          });
        }

        if (user.isVerify === false) {
          return done(null, false, {
            message: 'Vui lòng check mail để xác thực'
          });
        }
        req.session.isVerify = true;

        bcrypt.compare(password, user.password, async (err, result) => {
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
      passReqToCallback: true
    },
      async (req, email, password, done) => {
        console.log(email);
        User.findOne({ email: email }, async (err, user) => {

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

          const { name, email, passwords, phone } = req.body;
          let confirmPass = await randomstring.generate({
            length: 6
          });

          const passwordReset = confirmPass;
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
                const token = jwt.sign({ _id: user._id }, jwtKey, {
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

  /**
 * Facebook strategy OAuth
 */
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'link', 'name', 'photos', 'email'],
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        process.nextTick(function () {
          User.findOne(
            {
              $or: [
                { 'facebook.id': profile.id },
                { email: profile.emails[0].value },
              ],
            },
            function (err, user) {
              if (err) {
                return done(err);
              }

              if (user) {
                if (user.facebook.id == undefined) {
                  user.facebook.id = profile.id;
                  user.facebook.token = accessToken;
                  user.name = profile.displayName;
                  user.email = profile.emails[0].value;
                  user.isVerify = true;
                  user.image = profile.photos[0].value;

                  user.save();
                }

                return done(null, user);
              } else {
                let newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.name = profile.displayName;
                newUser.email = profile.emails[0].value;
                newUser.isVerify = true;
                newUser.avatar = profile.photos[0].value;

                newUser.save((err) => {
                  if (err) {
                    console.log(err);
                    throw err;
                  }

                  return done(null, newUser);
                });
              }
            }
          );
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL
    },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        process.nextTick(function () {
          User.findOne(
            {
              $or: [
                { 'google.id': profile.id },
                { email: profile.emails[0].value },
              ],
            },
            function (err, user) {
              if (err) {
                return done(err);
              }

              const initUser = {
                google: {
                  id: profile.id,
                  token: accessToken
                },
                name: profile.displayName,
                email: profile.emails[0].value,
                isVerify: profile.emails[1].value,
                image: profile.photos[0].value
              }

              if (user) {
                if (user.google.id == undefined) {

                  user = Object.assign(user, initUser);
                  user.save();
                }

                return done(null, user);
              } else {
                let newUser = new User();

                newUser = Object.assign(newUser, initUser);


                newUser.save((err) => {
                  if (err) {
                    console.log(err);
                    throw err;
                  }

                  return done(null, newUser);
                });
              }
            }
          );
        });
      }
    ));
};