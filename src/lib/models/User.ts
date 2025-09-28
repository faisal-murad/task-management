import mongoose, { HydratedDocument } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: { type: Boolean, default: false },
    verificationCode: String,
    verificationCodeExpiry: Date,
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

  export type IUser = HydratedDocument<typeof User>;