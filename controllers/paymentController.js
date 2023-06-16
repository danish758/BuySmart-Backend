const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  "sk_test_51NFxvWEqQQyDJWzOsAUWzVxmiTLjT7QTqNO2n3jmuNs4dtF4UVCBzHa9Luw5Bj8AD9HHD47jq4DLY6GChGGeAcGu00z94RjVOK"
);
const Cart = require("../models/cartModal");
const Products = require("../models/productsModal");

// Redirecting to stripe's website for payment accepting
const paymentIntent = asyncHandler(async (req, res) => {
  const cart = await Cart.find({ user: req.user.id });
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
    console.log(paymentIntent);

    products.push(Prod);
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: products.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product,
              // images: [`${item.picture}`],
            },
            unit_amount: `${item.price * 100}`,
          },
          quantity: item.count,
        };
      }),
      success_url: `http://127.0.0.1:5173/payment_success`,
      cancel_url: `http://127.0.0.1:5173/ecom/payment_reject`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Using stripe form on our website instead of redirecting to stripe's website

const paymentSecret = asyncHandler(async (req, res) => {
  const PaymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "aed",
    automatic_payment_methods: {
      enabled: false,
    },
  });
  const intent = PaymentIntent;
  console.log("intent", intent);
  res.json({ client_secret: intent.client_secret });
});

module.exports = { paymentIntent, paymentSecret };
