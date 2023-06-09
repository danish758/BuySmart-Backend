const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Products = require("../models/productsModal");
const Cart = require("../models/cartModal");

//@desc Register a user
//@route POST /api/users/register
//@access public
const addToCart = asyncHandler(async (req, res) => {
  const { product } = req.body;
  const user = req.user.id;
  if (!product || !user) {
    res.status(400);
    throw new Error("No Product Selected!");
  }
  const productAvailable = await Products.findById(product);
  const alreadyAvailable = await Cart.findOne({
    product: product,
    user: user,
  });
  if (alreadyAvailable) {
    if (alreadyAvailable.count < 3) {
      const updated = await Cart.updateOne(
        { _id: alreadyAvailable._id },
        { $inc: { count: 1 } }
      );
      const updatedCart = await Cart.findById(alreadyAvailable._id);
      res.status(201).json({
        product: updatedCart.product,
        price: updatedCart.price,
        picture: updatedCart.picture,
        count: updatedCart.count,
        message: "Product Updated",
      });
    } else {
      res.status(400);
      throw new Error("You can only buy 3 same products!");
    }
  } else {
    if (!productAvailable) {
      res.status(400);
      throw new Error("Cannot add to cart");
    } else {
      const newCart = {
        product: productAvailable._id,
        price: productAvailable.price,
        picture: productAvailable.picture,
        user: user,
        count: 1,
      };
      await Cart.create(newCart);

      res.status(201).json({
        product: productAvailable.product,
        price: productAvailable.price,
        picture: productAvailable.picture,
        count: 1,
        message: "Product added to cart",
      });
    }
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { product } = req.body;
  const user = req.user.id;
  if (!product || !user) {
    res.status(400);
    throw new Error("No Product Selected!");
  }
  const productAvailable = await Cart.find({
    product: product,
    user: user,
  });
  if (!productAvailable) {
    res.status(400);
    throw new Error("Cannot remove from cart");
  } else {
    if (productAvailable.length > 0) {
      let rem;
      if (productAvailable[0].count > 1) {
        rem = await Cart.updateOne(
          { product: product },
          { $inc: { count: -1 } }
        );
      } else {
        rem = await Cart.deleteOne({ product: product, user: user });
      }

      if (rem) {
        res.status(200).json({
          message: "Product removed from cart",
        });
      } else {
        res.status(400).json({
          message: "Cannot Remove",
        });
      }
    } else {
      res.status(400).json({
        message: "Cannot Remove",
      });
    }
  }
});
const emptyCart = asyncHandler(async (req, res) => {
  try {
    const user = req.user.id;
    if (!user) {
      res.status(400);
      throw new Error("No User found!");
    } else {
      const rem = await Cart.deleteMany({});
      if (rem) {
        res.status(201).json({
          message: "Now cart is empty!",
        });
      } else {
        res.status(400).json({
          message: "Cannot Remove",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

const getCart = asyncHandler(async (req, res) => {
  // console.log("user", req.user.id);
  const cart = await Cart.find({ user: req.user.id });
  // console.log("cart", cart);
  let products = [];
  for (let index = 0; index < cart.length; index++) {
    const product = await Products.findOne({ _id: cart[index]?.product });
    let Prod = {
      _id: product._id,
      product: product.product,
      price: product.price,
      picture: product.picture,
      count: cart[index].count,
    };

    products.push(Prod);
  }
  if (products) {
    res.status(201).json({
      products,
      message: "Products Fetched",
    });
  } else {
    res.status(401);
    throw new Error("Cannot fetch Cart");
  }
});

module.exports = { addToCart, getCart, removeFromCart, emptyCart };
