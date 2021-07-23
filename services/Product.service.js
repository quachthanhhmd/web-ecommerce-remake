const { findOneAndDelete } = require("../models/cart.model");
const ProdMongoose = require("../models/product.model");

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

    return  await ProdMongoose.findOne({slugName: sl});
}

module.exports.countProducts =  async (_id) =>{

    ProdMongoose.findById(_id)
    .then(product =>{

        product.soldQuantity += 1;

        product.save();
    })
}

module.exports.updateComments = async(slugName, comment) =>{

    var product =  await this.findbySlugname(slugName);

    product.comments.unshift(comment);
    
    await product.save();
    return product;
}