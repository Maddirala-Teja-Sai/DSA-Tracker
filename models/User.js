const mongoose = require("mongoose");

const customQuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    level: { type: String, default: "Medium" },
    category: { type: String, default: "Array" },
    title: { type: String, required: true },
    link: { type: String, default: "" },
    platform: { type: String, default: "LeetCode" },
    frequency: { type: Number, default: 3 },
    topics: { type: [String], default: [] },
    isCustom: { type: Boolean, default: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    passwordHash: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["google", "local"],
      default: "google",
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    trackerData: {
      solved: {
        type: [String],
        default: [],
      },
      starred: {
        type: [String],
        default: [],
      },
      notes: {
        type: Map,
        of: String,
        default: () => new Map(),
      },
      solvedDates: {
        type: Map,
        of: String,
        default: () => new Map(),
      },
      activity: {
        type: Map,
        of: Number,
        default: () => new Map(),
      },
      customQuestions: {
        type: [customQuestionSchema],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Helper to format safe JSON representation for client
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    name: this.name || this.email.split("@")[0],
    avatar: this.avatar,
    authProvider: this.authProvider,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
