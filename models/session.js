const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});
module.exports = mongoose.model("Session", sessionSchema);
