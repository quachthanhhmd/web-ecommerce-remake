const Cart = require("../models/cart.model");
const Product = require("../models/product.model")

const cartService = require("../services/cart.service");
const productService = require("../services/Product.service")
const userSevice = require("../services/user.Service");

const { parsePrice, parseIntToPrice } = require("../utilities/price");



module.exports.displayCart = async (req, res, next) => {


  const { user } = req;

  try {

    var userCart;

    if (user) {
      userCart = await cartService.findIdbyStatus(user._id, "waiting");

      if (!userCart)
        req.session.cart = await Cart.create({ userId: user._id });
    }
    else
      userCart = req.session.cart;

    return res.render("pages/cart", {
      title: "Cart",
      cart: userCart,
    })

  } catch (err) {
    res.render("error", {
      message: "Cart fail!",
      err,
    });
  }

}


module.exports.addToCart = async (req, res, next) => {
  const { user } = req;
  let { cart } = req.session;
  const { slugName } = req.params;

  let flagNewItem = true;

  try {
    if (user) {
      const userCart = await cartService.findIdbyStatus(user._id, "waiting");

      if (!userCart) {
        cart = await cartService.createCartbyId(user._id);
      }
      else
        cart = userCart;
    }

    const product = await productService.findbySlugname(slugName);

    if (!product)
      throw new Error("Product not found!");

    const { _id, name, price, images } = product;

    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].name === name) {
        cart.items[i].quantity++;
        var tmpTotal = parsePrice(cart.items[i].total);

        cart.items[i].total = parseIntToPrice((tmpTotal + parsePrice(price)).toString());

        cart.items[i].checkItem = cart.items[i].quantity == 1 ? 0 : 1;
        flagNewItem = false;
      }
    }

    if (flagNewItem) {
      cart.items.push({
        itemId: _id,
        name,
        slugName,
        thumbnail: images[0],
        price,
        quantity: 1,
        total: (price),
        checkItem: 0,
      });
    }

    cart.totalQuantity++;

    var tmp = parseInt(parsePrice(cart.totalCost));


    var s = parseIntToPrice((parsePrice(price) + tmp).toString());


    while (s.charAt(0) === '0') {
      s = s.substr(1);
    }


    cart.totalCost = s;


    if (user) {

      await cartService.updateOne(user._id, cart);

    }


    req.session.cart = cart;
    res.status(200).json({
      msg: "success",
      user: "Add successful!",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
};


// put update ajax
module.exports.putUpdate = async (req, res, next) => {


  const { bias } = req.body;

  const { slugName } = req.params;
  const { user } = req;
  let { cart } = req.session;
  const typeChange = [-1, 1, 0];


  try {
    if (user) {
      const userCart = await cartService.findIdbyStatus(user._id, "waiting")

      if (!userCart) {
        cart = await cartService.createCartbyId(user._id);
      }
      else cart = userCart;
    }

    if (!typeChange.includes(bias))
      throw new Error(`Bias wrong!`);

    cart.items = cart.items.map((item) => {
      if (item.slugName === slugName) {
        if (bias === 0) {
          cart.totalQuantity -= parseInt(item.quantity);
          var tmp = parsePrice(cart.totalCost);
          tmp -= parseInt(item.quantity) * parsePrice(item.price);

          cart.totalCost = parseIntToPrice(tmp.toString());

          while (cart.totalCost.charAt(0) === '0' && cart.totalCost.charAt(1) !== 'đ') {
            cart.totalCost = cart.totalCost.substr(1);
          }


          return null;
        }


        if (item.quantity === 1 && bias === -1) {

          cart.totalQuantity += bias;

          var tmp = parsePrice(cart.totalCost);
          tmp += bias * parsePrice(item.price);

          cart.totalCost = parseIntToPrice(tmp.toString());
          while (cart.totalCost.charAt(0) === '0') {
            cart.totalCost = cart.totalCost.substr(1);
          }


          item.quantity += bias;

          tmp = parsePrice(item.total);
          tmp += bias * parsePrice(item.price);

          item.total = parseIntToPrice(tmp.toString());
          while (item.total.charAt(0) === '0') {
            item.total = cart.totalCost.substr(1);
          }


          return null;
        }
        else {
          cart.totalQuantity += bias;
          var tmp = parsePrice(cart.totalCost);
          tmp += bias * parsePrice(item.price);

          cart.totalCost = parseIntToPrice(tmp.toString());
          while (cart.totalCost.charAt(0) === '0') {
            cart.totalCost = cart.totalCost.substr(1);
          }
          item.quantity += bias;

          tmp = parsePrice(item.total);

          tmp += bias * parsePrice(item.price);

          item.total = parseIntToPrice(tmp.toString());

          while (item.total.charAt(0) === '0') {
            item.total = cart.totalCost.substr(1);
          }

        }
      }

      return item;
    });

    cart.items = cart.items.filter((item) => item !== null);

    if (user) {

      for (let i = 0; i < cart.items.length; i++)
        cart.items[i].checkItem = cart.items[i].quantity == 1 ? 0 : 1;

      await cartService.updateOne(user._id, cart)

    }

    req.session.cart = cart;
    res.status(200).json({
      msg: "success",
      user: "Update cart successful!",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
};



module.exports.mergeCart = async (userId, sessionCart) => {
  try {
    let cart = {};

    const userCart = await cartService.findIdbyStatus(userId, "waiting");

    if (!userCart) {
      sessionCart.userId = userId;
      cart = await Cart.create(sessionCart);
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
      console.log(cart.totalQuantity, sessionCart.totalQuantity)
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

//promotion product
module.exports.CheckPromotion = async (req, res) => {

  try {
    const { promotionCode } = req.body;

    const { Id } = req.params;

    var cart = await cartService.findCartbyId(Id);

    let promotion = 0;

    for (let product of cart.items) {

      const infoProduct = await productService.findById(product.itemId);

      if (infoProduct === null)
        throw new Error("Product not found!!");

      if (infoProduct.promotion.code === promotionCode) {

        cart.discountPrice = parseIntToPrice(((0.03 * parseInt(parsePrice(cart.totalCost)) > infoProduct.promotion.desc) ? 200000 : 0.03 * parseInt(parsePrice(cart.totalCost))).toString());
        cart.discountRate = 3;
        cart.payment = parseIntToPrice((parseInt(parsePrice(cart.totalCost)) - parseInt(parsePrice(cart.discountPrice))).toString());


        cart.promotionCode = promotionCode;

        promotion = 1;
        break;
      }
    };


    if (promotion === 0) {
      return res.status(200).json({
        msg: "success",
        user: "Promotion does not exist",
        data: {},
      });
    }
    const promotionData = {
      payment: cart.payment,
      discountRate: cart.discountRate,
      discount: cart.discountPrice
    }

    //save data
    await cart.save();

    res.status(200).json({
      msg: "success",
      user: "Check promotion success",
      data: promotionData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
}

//promotion product
module.exports.RemovePromotion = async (req, res) => {

  try {
    const { promotionCode } = req.body;
    const { Id } = req.params;
    console.log(promotionCode);
    var cart = await cartService.findCartbyId(Id);



    if (promotionCode !== "") {
      cart.payment = cart.totalCost;
      cart.discountRate = 0;
      cart.discountPrice = "";
      cart.promotionCode = "";
    }

    await cart.save();

    const promotionResult = {
      payment: cart.payment
    }
    //check use max promotion if 
    res.status(200).json({
      msg: "success",
      user: "Remove promotion success",
      data: promotionResult
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
}