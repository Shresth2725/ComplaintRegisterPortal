import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLenght: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    address: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    otp: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.checkPassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

export default User;
