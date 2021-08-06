const tokenLife = process.env.TOKEN_LIFE
const jwtKey = process.env.JWT_KEY

const passport = require('passport');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");

const User = require('../models/user.model');

const { sendEmail } = require('../config/nodemailer');
const { mergeCart } = require("../utilities/merge");



module.exports.getLogin = (req, res, next) => {
    const message = req.flash("error")[0];


    var message2 = req.flash("success")[0];


    res.render("pages/login", {
        title: "Login",
        message: message,
        message2: message2,
    });

}

module.exports.postLogin = async (req, res, next) => {

    try {
        passport.authenticate("localSignin", function (err, user, info) {

            if (err)
                return next(err);

            if (!user)
                return redirect("/buyer/login");

            req.logIn(user, async function (err) {

                if (err)
                    return next(err);

                return redirect(req.session.historyUrl || "/");
            })
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: error
        })
    }
}

exports.getRegister = (req, res, next) => {
    res.render('pages/signup',
        { title: "Sign up" });
}

exports.getForgot = (req, res, next) => {

    res.render('pages/forgot',
        { title: "Forgot password" });
}




module.exports.getOne = async (req, res) => {

    const _id = req.session.passport.user;


    User.findById(_id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    msg: 'User not found!'
                })
            } else {
                res.render('pages/user', {
                    title: "Profile",
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                msg: 'Server error!',
                error
            })
        })
}

module.exports.postForgot = async (req, res) => {

    try {
        User.findOne({ email: req.body.email }, (err, user) => {

            if (user) {


                const token = jwt.sign({ _id: user._id }, jwtKey, {
                    expiresIn: 86400,
                });

                sendEmail(req, user.email, user.passwordReset, 'recovery');


                res.redirect('checkforgot/' + token);


            }

        });
    } catch (error) {
        res.status(404).json({
            error
        })
    }
}

module.exports.forgot = async (req, res) => {

    const { token } = req.params;
    const code = req.body.code;

    if (!token) {
        return res.status(404).json({
            msg: 'Invalid!'
        })
    }


    try {

        const decoded = jwt.verify(token, jwtKey)
        const { _id } = decoded;

        User.findById(_id)
            .then(async user => {
                if (!user) {

                    return res.status(404).json({
                        msg: 'Email not found!'
                    });
                }
                else {

                    if (code == user.passwordReset) {



                        //sinh ma xac nhan
                        let confirmPass = randomstring.generate({
                            length: 6
                        });
                        user.passwordReset = confirmPass;

                        user.save();
                        res.redirect("/buyer/resetPassword/" + token);
                    }
                    else {
                        req.session.message2 = 'This code does not match';
                        res.redirect("/buyer/checkforgot/" + token);

                    }

                }
            })
            .catch(error => {
                res.status(500).json({
                    msg: 'Server error!',
                    error
                })
            })


    } catch (error) {
        res.status(404).json({
            error
        })
    }

}

module.exports.postResetPassword = async (req, res) => {

    const { token } = req.params;

    if (!token) {
        return res.status(404).json({
            msg: 'Invalid!'
        })
    }

    try {
        const decoded = jwt.verify(token, jwtKey)
        const { _id } = decoded;
        const { password, password2 } = req.body;



        User.findById({ _id })
            .then(user => {

                if (!user) {
                    return res.status(404).json({
                        msg: 'user does not exists'
                    })
                }

                bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), function (err, hashPass) { //Mã hóa mật khẩu trước khi lưu vào db


                    user.password = hashPass;


                    user.save();



                    res.redirect('/buyer/login');
                })
            });
    } catch (err) {
        res.status(404).json({
            err
        })
    }
}

module.exports.confirm = (req, res) => {

    const { token } = req.params;

    if (!token) {
        return res.status(404).json({
            msg: 'Invalid!'
        })
    }

    try {

        const decoded = jwt.verify(token, jwtKey)
        const { _id } = decoded;

        User.findById(_id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        msg: 'User not found!'
                    })
                }

                if (user.isVerify) {
                    return res.status(200).json({
                        msg: 'success'
                    })
                }

                user.isVerify = true

                user.save((error) => {
                    if (error) {
                        throw error;
                    }
                })

                res.redirect('/buyer/login');
            })
            .catch(error => {
                res.status(500).json({
                    msg: 'Server error!',
                    error
                })
            })

    } catch (error) {
        res.status(404).json({
            error
        })
    }

}

exports.getCheckFogot = (req, res) => {

    const { token } = req.params;
    const message2 = req.session.message2;

    delete req.session.message2;
    res.render('checkforgot', {
        title: "Check code",
        token: token,
        message2: message2
    });

}


exports.getResetPassword = (req, res) => {

    const { token } = req.params;
    res.render("resetPassword", {
        title: "Reset Password",
        token
    })

}


module.exports.checkSingup = async (req, res, next) => {

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    try {
        const key = Object.keys(req.body)[0];

        let respond = {
            msg: 'success',
        };

        switch (key) {
            case 'email': {
                const userWithEmail = await User.findOne({ email: req.body[key] });

                if (userWithEmail) {
                    respond.email = 'Your email address is already! ';

                }
                if (!req.body[key].match(emailRegex)) {
                    respond.email = 'Invalid email!';
                }
                break;
            }
            case 'phone': {
                const userWithPhone = await User.findOne({ phone: req.body[key] });
                if (userWithPhone) {
                    respond.phone = 'Your phone number is already! ';

                }
                if (!req.body[key].match(phoneRegex)) {
                    respond.phone = 'Invalid phone';
                }
                break;
            }
            case 'password': {
                if (req.body[key].length < 6) {
                    respond.password = 'The minimum password length is 6!';
                } else if (req.body[key].length > 30) {
                    respond.password = 'The maximum password length is 30!';
                }
                break;
            }
        }

        if (Object.keys(respond).length > 1) {
            respond.msg = 'error';
        }

        res.status(200).json(respond);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            msg: error.message,
            error,
        });
    }
}




module.exports.getFacebookCallback = (req, res, next) => {


    passport.authenticate('facebook', function (err, user, info) {


        if (err) return next(err);

        if (!user) return redirect("buyer/login");

        req.logIn(user, async function (err) {
            if (err) {
                return next(err);
            }

            // Sync cart
            const cart = await mergeCart(user._id, req.session.cart);
            req.session.cart = cart;

            return res.redirect(req.session.historyUrl || '/');
        });

    })(req, res, next);

}

/* OAuth with google */
module.exports.getGoogleCallback = (req, res, next) => {

    passport.authenticate("google", function (err, user, info) {

        if (err) next(err);

        if (!user) res.redirect("/buyer/login");

        req.logIn(user, async function (err) {
            if (err) {
                return next(err);
            }

            // Sync cart
            const cart = await mergeCart(user._id, req.session.cart);

            req.session.cart = cart;

            return res.redirect(req.session.historyUrl || '/');
        })
    })(req, res, next);
}
