const { findOneAndDelete } = require("../models/cart.model");
const ProdMongoose = require("../models/product.model");

module.exports.listAllProduct = async () => {
    return await ProdMongoose.find({});
}

module.exports.listProdPagination = async (filter, pageNumber, itemPerPage) => {
    let listProd = await ProdMongoose.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return listProd;
};

module.exports.findbySlugname = async (sl) => {

    return await ProdMongoose.findOne({ slugName: sl });
}

module.exports.findById = async (id) => {

    return await ProdMongoose.findById(id);

}

module.exports.countProducts = async (_id) => {

    ProdMongoose.findById(_id)
        .then(product => {

            product.soldQuantity += 1;

            product.save();
        })
}

module.exports.updateComments = async (slugName, comment) => {

    var product = await this.findbySlugname(slugName);

    product.comments.unshift(comment);

    await product.save();
    return product;
}

module.exports.getResource = async () => {
    const products = await ProdMongoose.find()
        .distinct("type");
    var id = 0;

    const allType = await Promise.all(products.map(async (type) => {

        const smart = await ProdMongoose.find({
            type: type
        }).distinct('device');

        const device = await Promise.all(smart.map(async (device) => {


            let tmp = {

                "name": "",
                "values": [],
                "id": 0
            };
            tmp.name = device;
            //console.log(type);
            tmp.values = await ProdMongoose.find({
                type: type,
                device: device
            }).distinct("producer");
            tmp.id = id++;

            return tmp;
        }));

        return {
            type: type,
            brand: device,
            idBrand: id++
        };
    }))

    return allType;
}

module.exports.findBrandPopular = async (quantity = 10) => {

    var brand = await ProdMongoose.aggregate([
        {
            $group: {
                _id: '$producer',
                count: { $sum: 1 }
            }
        }
    ])

    brand.sort((a, b) => b.count - a.count);

    return brand.slice(0, quantity);
}