var express = require('express');
var router = express.Router();
const shopController = require('../controllers/shop.controller');
const productDetailsController = require('../controllers/productDetails.controller');
const homeController = require('../controllers/home.controller');

//router.get('/', shopController.listProductPagination);

router.get("/search", shopController.getSearch);

module.exports = router;