var express = require('express');
var router = express.Router();
const shopController = require('../controllers/shop.controller');
const productDetailsController = require('../controllers/productDetails.controller');
const homeController = require('../controllers/home.controller');
const authorize = require("../middleware/auth");

/* GET home page. */
router.get('/', homeController.index);

router.get('/product-details/:slugName', productDetailsController.detail);
router.post('/product-details/comments/', productDetailsController.getComments);
router.post("/product-details/commentuser/:slugName", authorize.auth, productDetailsController.postComment);

module.exports = router;
