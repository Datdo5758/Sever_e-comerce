const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    content: [
      {
        message: {
          type: String,
          required: true,
        },
        is_admin: {
          type: Boolean,
          required: true,
        },
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
