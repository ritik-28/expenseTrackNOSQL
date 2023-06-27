const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgotpwdSchema = new Schema({
  id: {
    type: mongoose.SchemaTypes.UUID,
  },
  isactive: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

forgotpwdSchema.set("timestamps", true);

module.exports = mongoose.model("ForgotPasswordRequest", forgotpwdSchema);
