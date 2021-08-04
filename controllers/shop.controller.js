const ProductService = require('../services/Product.service.js');
const Product = require("../models/product.model");

const { clean } = require("../utilities/handleObject");

const ITEM_PER_PAGE = 12;


module.exports.index = async (req, res, next) => {
    const products = await ProductService.listAllProduct();

    res.render('shop', { title: "Products", subtitle: "List product", products });
}

// module.exports.listProductPagination = async (req, res) => {
//     const page = +req.query.page || 1;
//     const Category = req.query.category;
//     const Name = req.query.name;
//     const Query = {};
//     if (Category) {
//         Query.category = Category;
//     }
//     if (Name) {
//         Query.name = Name;
//     }
//     const pagination = await ProductService.listProdPagination(Query, page, 12);
//     res.render('pages/shop', {
//         title: 'Shop',
//         products: pagination.docs,
//         hasNextPage: pagination.hasNextPage,
//         hasPrevPage: pagination.hasPrevPage,
//         nextPage: pagination.nextPage,
//         prevPage: pagination.prevPage,
//         lastPage: pagination.totalPages,
//         currentPage: pagination.page,

//         //index page
//         hasPrevPage1: (pagination.page - 2 > 0 ? true : false),
//         prevPage1: pagination.page - 2,
//         hasPrevPage2: (pagination.page - 1 > 0 ? true : false),
//         prevPage2: pagination.page - 1,
//         hasNextPage1: (pagination.page + 1 < pagination.totalPages ? true : false),
//         nextPage1: pagination.page + 1,
//         hasNextPage2: (pagination.page + 2 < pagination.totalPages ? true : false),
//         nextPage2: pagination.page + 2,

//         //Category
//         Category: Category
//     })
//}

const listQuery = (query, brands, category, device) => {

    return {
        "query": query,
        "category": category,
        "brand": brands,
        "device": device
    }
};




const queryString = (query) => {

    var result = "";
    for (let key in query) {
        if (query.hasOwnProperty(key)) {

            if (query[key] !== undefined && query[key] !== null && query[key] !== "") {
                result += `${key}=${query[key]}&`
            }
        }

    }

    if (result.charAt(result.length - 1) === "&" && result.indexOf("page") !== -1) {
        result = result.substr(0, result.length - 2);
    }

    return result;
}

module.exports.getSearch = async (req, res, next) => {

    try {

        let { query, producer, device, type } = req.query;

        if (type === "Laptop ")
            type = "Laptop & Macbook";

        const page = +(req.query.page) || 1;

        console.log(type);
        const Query = clean({ query, producer, type, device });



        const dataProduct = await ProductService.listProdPagination(Query, page, 12);


        res.render('pages/shop', {
            title: 'Shop',
            products: dataProduct.data,
            maxPage: dataProduct.pages,
            page: page
        })

    } catch (error) {

        res.status(404).json({
            msg: "Fail!!"
        })
    }
}