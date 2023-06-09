const mongoose = require("mongoose");

const { Schema } = mongoose;
const cartSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  product: { type: Schema.Types.ObjectId, ref: "products" },
  count: Number,
  price: Number,
  picture: String,
});

module.exports = mongoose.model("cart", cartSchema);
