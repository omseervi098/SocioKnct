const mongoose = require("mongoose");
const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Vote = mongoose.model("Vote", voteSchema);
module.exports = Vote;
