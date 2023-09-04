const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  is_admin: {
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "client", "consultant"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
