const express = require("express");

const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/", cartController.displayCart);

router.post("/:slugName", cartController.addToCart);
router.put("/:slugName", cartController.putUpdate);

router.put("/promotion/:Id", cartController.CheckPromotion);
router.put("/promotion/delete/:Id", cartController.RemovePromotion);

module.exports = router;