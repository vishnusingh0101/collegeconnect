const express = require("express");
const { createOrder, verifyPayment } = require("../controller/payment");

const router = express.Router();

router.post("/create-order", createOrder);

module.exports = router;