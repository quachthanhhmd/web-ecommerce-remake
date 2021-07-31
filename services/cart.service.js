const Cart = require("../models/cart.model")
const ProductSevice = require("./Product.service");

module.exports.findIdbyStatus = (id, status) => {

    return Cart.findOne({
        userId: id,
        status: status,
    });
}

module.exports.updateOne = async (id, cart) => {

    //delte _id of mongoose exists

    const check = cart.userId.filter(x => x.equals(id))
    if (check.length === 0)
        cart.userId.push(id);

    cart.markModified('items');
    return await cart.save();

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

module.exports.createCart = async (cart) => {

    return await Cart.create(cart);
}

module.exports.initCart = {
    userId: [],
    status: "waiting",
    items: [],
    totalQuantity: 0,
    totalCost: 0,
};