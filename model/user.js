const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPrimium: Boolean,
  totalExpense: {
    type: Number,
    defaultValue: 0,
  },
});

userSchema.set("timestamps", true);

module.exports = mongoose.model("User", userSchema);
