const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  addToCart,
  getCart,
  removeFromCart,
  emptyCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/", validateToken, addToCart);
router.get("/", validateToken, getCart);

router.delete("/", validateToken, removeFromCart);
router.delete("/delete_all", validateToken, emptyCart);

// router.get("/", currentUser);

module.exports = router;
