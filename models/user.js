import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    tokenVersion: { type: Number, default: 0 },
    age: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
