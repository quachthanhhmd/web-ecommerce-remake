const express = require("express");
const authorize = require("../middleware/auth");

const router = express.Router();
const checkoutController = require("../controllers/checkout.controller");

router.get("/", authorize.auth, checkoutController.getCheckout);
router.post("/", authorize.auth, checkoutController.postCheckout);

module.exports = router;