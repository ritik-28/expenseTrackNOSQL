const Expenses = require("../model/expense");
const Income = require("../model/income");

const monthdata = async (req, res, next) => {
  try {
    const month = req.query.month;
    const dataexpense = await Expenses.find({
      $and: [{ createdAt: { $gte: month } }, { userId: req.user._id }],
    })
      .sort({ createdAt: "desc" })
      .select("amount createdAt description category");

    const dataIncome = await Income.find({
      $and: [{ createdAt: { $gte: month } }, { userId: req.user._id }],
    })
      .sort({ createdAt: "desc" })
      .select("amount createdAt description");

    res.status(200).json({ dataexpense, dataIncome });
  } catch (err) {
    res.status(500).json({ success: false, err: err });
  }
};

const yeardata = async (req, res, next) => {
  try {
    const month = req.query.year;
    const dataexpense = await Expenses.find({
      $and: [{ createdAt: { $gte: month } }, { userId: req.user._id }],
    })
      .sort({ createdAt: "desc" })
      .select("amount createdAt");

    const dataIncome = await Income.find({
      $and: [{ createdAt: { $gte: month } }, { userId: req.user._id }],
    })
      .sort({ createdAt: "desc" })
      .select("amount createdAt");

    res.status(200).json({ dataexpense, dataIncome });
  } catch (err) {
    res.status(500).json({ err: err, yeardata: "no data found error" });
  }
};

module.exports = { monthdata, yeardata };
