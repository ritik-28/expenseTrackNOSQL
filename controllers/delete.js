const Expenses = require("../model/expense");
const User = require("../model/user");
const Income = require("../model/income");

const deleteExpenses = async (req, res, next) => {
  try {
    const got = await User.findOne({
      _id: req.user.id,
    });
    const deletedExp = await Expenses.findOneAndDelete({
      _id: req.params.id,
    });
    const totalExpense = Number(got.totalExpense) - Number(deletedExp.amount);
    await User.updateOne(
      {
        _id: req.user.id,
      },
      {
        $set: {
          totalExpense: totalExpense,
        },
      }
    );
    res.status(201).json("records deleted");
  } catch (err) {
    res.status(500).json({ err: err, success: false });
  }
};

const deleteIncomes = async (req, res, next) => {
  try {
    await Income.deleteOne({
      _id: req.params.id,
    });
    res.status(201).json("records deleted");
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

module.exports = {
  deleteExpenses,
  deleteIncomes,
};
