const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is weak");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other", ""].includes(value)) {
          throw new Error("gender data is not valid");
        }
      },
    },
    // photoUrl: {
    //   type: String,
    //   default: "https://geographyandyou.com/images/user-profile.png",
    //   validate(value) {
    //     if (!validator.isURL(value)) {
    //       throw new Error("photoUrl is not valid");
    //     }
    //   },
    // },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        const isValidURL = validator.isURL(value);
        const isBase64Image =
          /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(value);
        if (!isValidURL && !isBase64Image) {
          throw new Error("photoUrl is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "this is a default about me",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@9712", {
    expiresIn: "1d",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
