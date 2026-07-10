import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 300 },
    location: { type: String, default: "" },

    skillsOffered: [
      {
        name: { type: String, required: true },
        level: { type: String, enum: ["Beginner", "Intermediate", "Expert"], default: "Intermediate" },
        description: { type: String, default: "" },
      },
    ],

    skillsWanted: [
      {
        name: { type: String, required: true },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      },
    ],

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
