import mongoose from "mongoose";
import { DEFAULT_HOURS, DEFAULT_MINUTES, DEFAULT_SECONDS } from "../index.js";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  isAvailableToCharge: { type: Boolean, default: true },
  chargerEnabledAt: { type: Number, default: null },
  timeRemaining: {
    type: {
      hours: Number,
      minutes: Number,
      seconds: Number,
    },
    default: {
      hours: DEFAULT_HOURS,
      minutes: DEFAULT_MINUTES,
      seconds: DEFAULT_SECONDS,
    },
  },
});

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
