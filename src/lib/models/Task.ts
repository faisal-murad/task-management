import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    priority: { type: String },
    status: {type: String}
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
