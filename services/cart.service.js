const Cart = require("../models/cart.model")
const ProductSevice = require("./Product.service");

module.exports.findIdbyStatus = (id, status) => {

    return Cart.findOne({
        userId: id,
        status: status,
    });
}

module.exports.updateOne = (id, cart) => {



    return Cart.updateOne(
        { userId: id, status: "waiting" },
        {
            $set: cart,
        }
    );
}

module.exports.findCartbyUserId = (userId) => {

    return Cart.findOne({ userId: userId })
}

module.exports.saveStatus = (id, status) => {

    return Cart.findById(id)
        .then(cart => {
            cart.status = status;
            cart.save();
        })
}

module.exports.countProduct = async (_id) => {

    Cart.findById(_id)
        .then(async cart => {


            for (let i = 0; i < cart.items.length; i++) {

                await ProductSevice.countProduct(cart.items[i].itemId);
            }

        })
}

module.exports.createCartbyId = async (_id) => {

    return await Cart.create({
        userId: _id
    });
}

module.exports.findCartbyId = async (_id) => {

    return await Cart.findById(_id);
}

module.exports.initCart = {
    userId: null,
    status: "waiting",
    items: [],
    totalQuantity: 0,
    totalCost: 0,
};