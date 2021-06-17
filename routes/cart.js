const express = require("express");

const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/", cartController.displayCart);

router.post("/:slugName", cartController.addToCart);
router.put("/:slugName", cartController.putUpdate);

module.exports = router;