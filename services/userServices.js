const Expense = require("../model/expense");

const getExpenses = async (req) => {
  const expenses = await Expense.find({ userId: req.user._id });
  return expenses;
};

module.exports = { getExpenses };
