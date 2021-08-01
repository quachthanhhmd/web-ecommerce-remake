const { Mongoose } = require("mongoose");
const Cart = require("../models/cart.model")
const ProductSevice = require("./Product.service");

module.exports.findIdbyStatus = (id, status) => {

    return Cart.findOne({
        userId: { "$all": id },
        status: status,
    });
}

module.exports.updateOne = async (id, cart) => {

    //delte _id of mongoose exists

    const check = cart.userId.filter(x => x.equals(id))
    if (check.length === 0)
        cart.userId.push(id);

    cart.markModified('items');
    await cart.save();

    return cart;
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

module.exports.findUserIdInArray = async (userIdList, userId) => {

    const check = userIdList.filter(x => x.equals(userId))

    return check.length === 0 ? 1 : 0;
}

module.exports.deleteOne = async (cart) => {

    return await cart.deleteOne(cart);
}

module.exports.pushElementToArray = async (cart, element) => {

    return await cart.updateOne(
        { _id: cart._id },
        { $push: { userId: element } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });

}

