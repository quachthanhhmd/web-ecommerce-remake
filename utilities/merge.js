const cartService = require("../services/cart.service")
const Cart = require('../models/cart.model');

const { parseIntToPrice, parsePrice } = require("./price");

/**
 * 
 * @param {Mongoose Id} userId 
 * @param {cart} sessionCart 
 * @returns {cart}
 */

const mergeCart = async (userId, sessionCart) => {
    try {
        let cart = new Cart(sessionCart);


        const userCart = await cartService.findIdbyStatus(userId, "waiting");
        console.log(userCart)

        if (!userCart) {

            //cart = await cartService.createCart(sessionCart);
            cart.userId.push(userId);
        }
        else if (userCart.totalQuantity === 0) {

            cart.userId.push(userId);

        } else {
            cart.userId.push(userId);
            const merCartItem = [...userCart.items, ...sessionCart.items];
            const slugName = Array.from(
                new Set(merCartItem.map((item) => item.slugName))
            );

            const items = slugName.map((slug) => {
                var uniSlug = merCartItem.filter((it) => it.slugName === slug);
                const staUniSlug = uniSlug.map((uni) => parseInt(uni.quantity));
                const quanti = staUniSlug.reduce((it1, it2) => it1 + it2, 0);

                uniSlug[0].quantity = quanti;
                uniSlug[0].total = parseIntToPrice((quanti * parsePrice(uniSlug[0].price)).toString());
                while (uniSlug[0].total.charAt(0) === '0') {
                    uniSlug[0].total = uniSlug[0].total.substr(1);
                }

                return uniSlug[0];
            });

            cart.items = items;

            cart.totalQuantity += sessionCart.totalQuantity;


            var tmp = parsePrice(cart.totalCost);
            var tmp2 = parsePrice(sessionCart.totalCost);
            var sum = tmp + tmp2;

            cart.totalCost = parseIntToPrice(sum.toString());
            while (cart.totalCost.charAt(0) === '0') {
                cart.totalCost = cart.totalCost.substr(1);
            }

        }

        //delete promotion
        if (cart.promotionCode !== "") {
            cart.promotionCode = "";
            cart.discountPrice = "";
            cart.discountRate = 0;
        }

        cart.payment = cart.totalCost;


        if (userCart) {

            cartService.deleteOne(userCart);
        }


        cartService.createCart(cart);

        console.log(cart);
        return cart;
    } catch (error) {
        console.log(error);

    }
};


module.exports = {
    mergeCart
}