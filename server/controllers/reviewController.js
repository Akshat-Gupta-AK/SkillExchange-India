import Review from "../models/Review.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
  try {
    const { toUser, matchId, rating, comment, skillTaught } = req.body;
    const existing = await Review.findOne({ fromUser: req.user._id, matchId });
    if (existing) return res.status(400).json({ message: "Already reviewed this match" });

    const review = await Review.create({
      fromUser: req.user._id,
      toUser,
      matchId,
      rating,
      comment,
      skillTaught,
    });

    // Update user average rating
    const reviews = await Review.find({ toUser });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(toUser, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      $inc: { sessionsCompleted: 1 },
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ toUser: req.params.userId })
      .populate("fromUser", "name avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
