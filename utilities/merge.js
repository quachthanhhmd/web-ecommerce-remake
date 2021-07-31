const cartService = require("../services/cart.service")

const { parseIntToPrice, parsePrice } = require("./price");

/**
 * 
 * @param {Mongoose Id} userId 
 * @param {cart} sessionCart 
 * @returns {cart}
 */

const mergeCart = async (userId, mergedCart) => {
    try {
        let cart = {};


        const sessionCart = mergedCart;

        if (sessionCart._id != undefined) {
            console.log(sessionCart._id);
            sessionCart.userId.push(sessionCart.userId);
            await cartService.deleteOne(mergedCart);
        }


        const userCart = await cartService.findIdbyStatus(userId, "waiting");

        if (!userCart) {
            sessionCart.userId.push(sessionCart.userId);

            console.log(cart._id);

            cart = await cartService.createCart(sessionCart);

            if (cartService.findUserIdInArray(cart.userId, userId)) {
                cartService.updateOne(userId, cart);
            }


        }
        else if (userCart.totalQuantity === 0) {

            //sessionCart.userId.push(userId);
            cart = await cartService.updateOne(userId, sessionCart)

        } else {
            cart = userCart;
            console.log(sessionCart);
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

        //delete promotion
        if (cart.promotionCode !== "") {
            cart.promotionCode = "";
            cart.discountPrice = "";
            cart.discountRate = 0;
        }

        cart.payment = cart.totalCost;

        return cart;
    } catch (error) {
        console.log(error);

    }
};


module.exports = {
    mergeCart
}