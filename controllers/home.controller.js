const Product = require('../models/product.model');
const { all } = require('../routes/checkout');
const ProductService = require('../services/Product.service')
const { changeDeviceToQueryName } = require("../utilities/constType");
const { ChangeToSlug } = require("../utilities/toSlugName");


module.exports.index = async (req, res, next) => {

    try {



        const deviceQuery = changeDeviceToQueryName();

        const productsSellingDevice = await Promise.all(deviceQuery.map(async (device) => {

            const products = await ProductService.findSelingbyFieldAndDevice(device, "countSale", 12);
            return {
                products,
                slugNameDevice: ChangeToSlug(device)
            }
        }
        ));

        const deviceName = deviceQuery.map(device => {
            return {
                nameDevice: device,
                slugNameDevice: ChangeToSlug(device)
            }
        });

        console.table(productsSellingDevice);

        const productsSelling = await ProductService.findSeling(9);

        res.render('pages/home', {

            product: productsSelling,
            productsSellingDevice,
            deviceName
        })

    } catch (error) {
        return res.status(200).json({
            msg: "Can not load page!!"
        })
    }
};