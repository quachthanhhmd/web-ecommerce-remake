const { findOneAndDelete } = require("../models/cart.model");
const ProdMongoose = require("../models/product.model");
const { clean } = require("../utilities/handleObject");



module.exports.listAllProduct = async () => {
    return await ProdMongoose.find({});
}


/**
 * Get list product paging and a mount of pages of product 
 * @param {string} strPrice : String price
 * @return {int} price
 */
module.exports.listProdPagination = async (filter, pageNumber, itemPerPage) => {


    if (filter.query !== undefined) {
        let search = { $text: { $search: filter.query } };
        delete filter.query;
        filter = Object.assign(filter, search);



    }
    console.log(filter);
    var products = await ProdMongoose.find(filter)
        .skip((pageNumber - 1) * itemPerPage)
        .limit(itemPerPage)

    const count = await this.countProductByQuery(filter);

    const maxPage = Math.floor(count / 12) + 1;



    return {
        data: products,
        pages: maxPage
    };
};

module.exports.findbySlugname = async (sl) => {

    return await ProdMongoose.findOne({ slugName: sl });
}

module.exports.findById = async (id) => {

    return await ProdMongoose.findById(id);

}


module.exports.countProductByQuery = async (query) => {

    return await ProdMongoose.find(query).countDocuments();

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

module.exports.findSelingbyFieldAndDevice = async (device, field, numProduct) => {



    const products = await ProdMongoose.find({
        device: device
    })
        .sort({ [field]: -1 })
        .skip(0)
        .limit(numProduct);

    return products;
}

module.exports.findSeling = async (numProduct) => {

    const products = await ProdMongoose.find({

    })
        .sort({ "countSale": -1 })
        .skip(0)
        .limit(numProduct);

    return products;
}