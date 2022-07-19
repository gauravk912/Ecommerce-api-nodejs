const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validator(value) {
        if (value.toLowerCase().include("password")) {
          throw new Error("Cannot contain password as PASSWORD");
        }
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      maxLength: 10,
    },
    street: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
