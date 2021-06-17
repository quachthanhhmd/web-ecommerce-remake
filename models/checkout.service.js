const { checkout } = require("../routes/checkout");
const Checkout = require("./checkout.model");



module.exports.saveNewCheckout = async (checkoutOfuser) => {

    const checkout = new Checkout(checkoutOfuser);

    return await checkout.save();
}

module.exports.find1checkout = async(userId) =>{


    return await Checkout.find({userId: userId});
}


module.exports.findCheckoutByID = async (_id) =>{

    return await Checkout.findById(_id);
}