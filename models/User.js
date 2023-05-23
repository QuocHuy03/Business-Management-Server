const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    area: { type: mongoose.Schema.Types.ObjectId, ref: "Areas" },
    email: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["leader", "employee"],
      default: "employee",
    },
    status: {
      type: String,
      enum: ["Online", "Office"],
      default: "Online",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", postSchema);
