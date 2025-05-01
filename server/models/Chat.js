const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;