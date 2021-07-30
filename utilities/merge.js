const cartService = require("../services/cart.service")

const { parseIntToPrice, parsePrice } = require("./price");

/**
 * 
 * @param {Mongoose Id} userId 
 * @param {cart} sessionCart 
 * @returns {cart}
 */

const mergeCart = async (userId, sessionCart) => {
    try {
        let cart = {};

        const userCart = await cartService.findIdbyStatus(userId, "waiting");

        if (!userCart) {
            sessionCart.userId = userId;
           
            cart = await cartService.createCart(sessionCart);
        }
        else if (userCart.totalQuantity === 0) {
            
            sessionCart.userId = userId;
            cart = await cartService.updateOne(userId, sessionCart)

        } else {
            cart = userCart;
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

            await cartService.updateOne(userId, cart);

        }

        return cart;
    } catch (error) {
        console.log(error);

    }
};


module.exports = {
    mergeCart
}