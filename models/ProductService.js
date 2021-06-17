const { findOneAndDelete } = require("./cart.model");
const ProdMongoose = require("./product.model");

module.exports.listAllProduct = async() => {
    return await ProdMongoose.find({});
}

module.exports.listProdPagination = async(filter, pageNumber, itemPerPage) => {
    let listProd = await ProdMongoose.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return listProd;
};

module.exports.findbySlugname = async(sl) =>{

    return ProdMongoose.findOne({slugName: sl});
}

module.exports.countProducts =  async (_id) =>{

    ProdMongoose.findById(_id)
    .then(product =>{

        product.soldQuantity += 1;

        product.save();
    })
}