const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    nameProject: {
      type: String,
      required: true,
    },
    teamSize: {
      type: String,
      required: true,
    },
    dateOfStart: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expense: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Projects", postSchema);
