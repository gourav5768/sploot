import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Article", articleSchema);
