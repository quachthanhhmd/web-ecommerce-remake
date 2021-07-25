const Product = require('../models/product.model');
const { all } = require('../routes/checkout');
const ProductService = require('../services/Product.service')


exports.index = async (req, res, next) => {
    // Get books from model
    const enumType = ["Điện thoại", "Máy tính bảng", "Phụ kiện", "Đồng hồ thông minh", "Thiết bị Smart Home"]
    //check auth
    // var type = Product.find({
    //     type: "Màn hình máy tính"
    // });
    // (await type).forEach(type => {
    //     if (type.slugName.indexOf("man-hinh-cong") !== -1) {

    //         type.device = "Màn Hình Cong";
    //         type.save();
    //     }

    // })












    Product.find({})
        .skip(0)
        .limit(9)
        .then(product => {

            res.render('pages/home', {
                product
            })
        })

};