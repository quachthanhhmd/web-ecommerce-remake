const Product= require('../models/product.model');

exports.detail = (req, res, next) => {
    // Get books from model
    
    Product.findById(req.params.id)
    .then(product =>{
        // Pass data to view to display list of books
        
        res.render('product-details', {
            pathImages: product.images,
            price: product.price,
            title: product.name
        });
        
    })

    
};