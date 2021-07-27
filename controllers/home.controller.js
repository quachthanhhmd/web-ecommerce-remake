const Product = require('../models/product.model');
const { all } = require('../routes/checkout');
const ProductService = require('../services/Product.service')


exports.index = async (req, res, next) => {


    Product.find({})
        .skip(0)
        .limit(9)
        .then(product => {

            res.render('pages/home', {
                product
            })
        })

};