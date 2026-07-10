import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 }, // in minutes
    topic: { type: String, required: true },
    meetingLink: { type: String, default: "" },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
