var express = require('express');
var router = express.Router();
const shopController = require('../controllers/shop.controller');
const productDetailsController = require('../controllers/productDetails.controller');
const homeController = require('../controllers/home.controller');
const { searchCache } = require('../middleware/redis.middleware')

//router.get('/', shopController.listProductPagination);

router.get("/search", searchCache, shopController.getSearch);

module.exports = router;