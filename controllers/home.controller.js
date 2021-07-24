const Product = require('../models/product.model');

exports.index = (req, res, next) => {
    // Get books from model

    //check auth

    Product.find({})
    .skip(0)
    .limit(9)
    .then(product =>{
        
        res.render('pages/home', {
            product
        })
    })
    
};