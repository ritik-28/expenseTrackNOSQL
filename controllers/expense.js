const Expenses = require("../model/expense");
const strVal = require("../util/strValidator");
const User = require("../model/user");

const expensePost = async (req, res, next) => {
  try {
    const { description, amount, category } = req.body;
    if (strVal(description) || strVal(amount) || strVal(category)) {
      return res.status(400).json({ err: "fill all feilds" });
    } else {
      const expense = await Expenses.create({
        description,
        amount,
        category,
        userId: req.user._id,
      });
      const totalExpense =
        Number(req.user.totalExpense) + Number(expense.amount);
      await User.updateOne(
        { _id: req.user._id },
        { $set: { totalExpense: totalExpense } }
      );
      return res
        .status(201)
        .json({ msg: "new expense created in table", id: expense._id });
    }
  } catch (err) {
    return res.status(403).json({ err: err });
  }
};

const expenseGet = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const ITEM_PER_PAGE = 10;
    const getRes = await Expenses.find({
      userId: req.user._id,
    })
      .skip((page - 1) * ITEM_PER_PAGE)
      .limit(ITEM_PER_PAGE)
      .sort({ createdAt: "desc" })
      .select("-userId -createdAt -updatedAt");

    const totalExpensepage = await Expenses.count({ userId: req.user._id });
    const arr = [];
    getRes.forEach((element) => {
      arr.push(element);
    });
    const isPremium = req.user.isPrimium;
    return res.json({ arr, isPremium, totalExpensepage });
  } catch (err) {
    return res.json({ err: err });
  }
};

module.exports = { expensePost, expenseGet };
