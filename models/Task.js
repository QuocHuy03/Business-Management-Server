const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    idProject: { type: mongoose.Schema.Types.ObjectId, ref: "Projects" },
    priority: {
      type: String,
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tasks", postSchema);
