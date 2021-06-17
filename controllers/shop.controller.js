const ProductService = require('../models/ProductService.js');
const Product = require("../models/product.model");
const ITEM_PER_PAGE = 12;
module.exports.index = async(req, res, next) => {
    const products = await ProductService.listAllProduct();

    res.render('shop', { title: "Products", subtitle: "List product", products });
}

module.exports.listProductPagination = async(req, res) => {
    const page = +req.query.page || 1;
    const Category = req.query.category;
    const Name = req.query.name;
    const Query = {};
    if (Category) {
        Query.category = Category;
    }
    if (Name) {
        Query.name = Name;
    }
    const pagination = await ProductService.listProdPagination(Query, page, 12);
    res.render('shop', {
        title: 'Shop',
        products: pagination.docs,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        lastPage: pagination.totalPages,
        currentPage: pagination.page,

        //index page
        hasPrevPage1: (pagination.page - 2 > 0 ? true : false),
        prevPage1: pagination.page - 2,
        hasPrevPage2: (pagination.page - 1 > 0 ? true : false),
        prevPage2: pagination.page - 1,
        hasNextPage1: (pagination.page + 1 < pagination.totalPages ? true : false),
        nextPage1: pagination.page + 1,
        hasNextPage2: (pagination.page + 2 < pagination.totalPages ? true : false),
        nextPage2: pagination.page + 2,

        //Category
        Category: Category
    })
}