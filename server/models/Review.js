import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 500 },
    skillTaught: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ fromUser: 1, matchId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
