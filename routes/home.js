var express = require('express');
var router = express.Router();
const shopController = require('../controllers/shop.controller');
const productDetailsController = require('../controllers/productDetails.controller');
const homeController = require('../controllers/home.controller');

/* GET home page. */
router.get('/', homeController.index);
router.get('/index', homeController.index);
router.get('/404', function(req, res, next) {
  res.render('404', { layout: false });
});
router.get('/blog-single', function(req, res, next) {
  res.render('blog-single', { title: 'Blog Single' });
});
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Blog' });
});

router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'Contact Us' });
});

router.get('/product-details/:id', productDetailsController.detail);


module.exports = router;
