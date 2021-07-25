const Product = require('../models/product.model');
const { all } = require('../routes/checkout');



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




    const products = await Product.find()
        .distinct("type");
    var id = 0;
    const allType = await Promise.all(products.map(async (type) => {

        const smart = await Product.find({
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
            tmp.values = await Product.find({
                type: type,
                device: device
            }).distinct("producer");
            tmp.id = id++;
            console.log(tmp.values)
            return tmp;
        }));

        return {
            type: type,
            brand: device,
            idBrand: id++
        };
    }))







    Product.find({})
        .skip(0)
        .limit(9)
        .then(product => {

            res.render('pages/home', {
                product,
                allType
            })
        })

};