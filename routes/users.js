const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');
const authorize = require("../middleware/auth");

const upload = require("./../config/multer");


/* GET users listing. */
router.route('/account/profile')
    .get(authorize.auth, user.getOne)
    .post(authorize.auth, upload.single("image"),  user.saveInfor);

router.get('/account/logout', authorize.auth, user.logout);


router.post('/account/changePassword', authorize.auth, user.changePassword );

router.post('/account/changePhone', authorize.auth, user.changeTel);

router.get('/checkout/:id',authorize.auth, user.viewCheckout);

router.post('/account/changeAddress',authorize.auth, user.changeAddress)


module.exports = router;
