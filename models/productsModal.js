const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Products", productsSchema);
