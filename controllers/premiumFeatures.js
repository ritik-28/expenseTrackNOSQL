const User = require("../model/user");

const premiumFeature = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("name totalExpense")
      .sort({ totalExpense: "desc" });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

module.exports = premiumFeature;
