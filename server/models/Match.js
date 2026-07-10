import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requesterSkill: { type: String, required: true }, // skill requester offers
    receiverSkill: { type: String, required: true },  // skill receiver offers
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending",
    },
    compatibilityScore: { type: Number, default: 0 },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent duplicate match requests
matchSchema.index({ requester: 1, receiver: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);
