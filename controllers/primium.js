const Razorpay = require("razorpay");

const Order = require("../model/orders");
const User = require("../model/user");
require("dotenv").config();

const purchasePrimium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error("order is not generated");
      }
      await Order.create({
        orderid: order.id,
        status: "PENDING",
        paymentid: null,
        userId: req.user._id,
      });
      return res.status(201).json({
        order,
        key_id: rzp.key_id,
      });
    });
  } catch (err) {
    res.json({ err: err });
  }
};

const updatetransactionstatus = async (req, res, next) => {
  try {
    const { order_id, payment_id } = req.body;
    const id = req.user._id;
    if (payment_id) {
      await Order.updateOne(
        { orderid: order_id },
        {
          $set: {
            paymentid: payment_id,
            status: "SUCCESFULL",
          },
        }
      );
      await User.updateOne(
        { _id: id },
        {
          $set: {
            isPrimium: true,
          },
        }
      );
      res
        .status(202)
        .json({ success: true, message: "Transaction Successful" });
    }
  } catch (err) {
    res.json({ err: err });
  }
};

const paymentfailed = async (req, res, next) => {
  try {
    await Order.updateOne(
      { orderid: req.body.order_id },
      {
        $set: {
          status: "FAILED",
        },
      }
    ),
      res.status(201).json({ success: false, message: "Transaction Failed" });
  } catch (err) {
    res.json({ err: err });
  }
};

module.exports = {
  purchasePrimium,
  updatetransactionstatus,
  paymentfailed,
};
