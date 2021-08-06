const User = require('../models/user.model');
var cookieParser = require('cookie-parser')

module.exports.auth = async (req, res, next) => {


    if (!req.isAuthenticated()) {
        req.session.historyUrl = req.originalUrl;
     

        res.redirect('/buyer/login');
        return;
    }
    let id = req.session.passport.user;

    User.findById(id, (err, result) => {

  
        if (!result) {
            req.session.historyUrl = req.originalUrl;
            console.log(req.originalUrl);
            res.redirect('/buyer/login');
            return;
        }
        else {
            if (!result.isVerify) {
                res.send("Please Verify");
                return;
            }
            else {
                //req.userData = result;

                return next();
            }
        }

    })


}
