const express = require("express");
const {
  paymentIntent,
  paymentSecret,
} = require("../controllers/paymentController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/create-checkout-session", validateToken, paymentIntent);
router.get("/secret", validateToken, paymentSecret);

module.exports = router;
