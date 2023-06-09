const asyncHandler = require("express-async-handler");
const Products = require("../models/productsModal");

const addProduct = asyncHandler(async (req, res) => {
  console.log("reqqqqqq", req?.body);
  // res.status(201).json({ message: "okkk" });
  try {
    const { product, price } = req.body || {};
    console.log("req", req?.file);
    const fileName = req?.file?.originalname;
    fileUrl = `http://localhost:${process.env.PORT}/${req?.file?.path}`;
    if (!product || !price || !fileName) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    await Products.create({ product, price, picture: fileUrl });
    res.status(201).json({ product, price, picture: fileUrl });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});
const getProducts = asyncHandler(async (req, res) => {
  const { key, page } = req?.query;
  let totalProducts = await Products.countDocuments();
  const limit = 6;
  let totalPages = Math.ceil(totalProducts / limit);
  // console.log("totalPages", totalPages);
  let prods;
  try {
    if (key) {
      //* For Pagination

      let products = await Products.find({
        product: { $regex: key, $options: "i" },
      });
      totalProducts = products.length;
      totalPages = Math.ceil(totalProducts / limit);

      //* Products against search key
      prods = await Products.find({
        product: { $regex: key, $options: "i" },
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      prods = await Products.find()
        .skip((page - 1) * limit)
        .limit(limit);
    }
    res.status(201).json({
      products: prods,
      message: "Products Fetched",
      totalPages,
    });
  } catch (error) {
    res.status(401);
    throw new Error("Cannot fetch Products");
  }
});
module.exports = { addProduct, getProducts };
