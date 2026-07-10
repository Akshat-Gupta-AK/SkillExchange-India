import Match from "../models/Match.js";
import User from "../models/User.js";

export const sendMatchRequest = async (req, res) => {
  try {
    const { receiverId, requesterSkill, receiverSkill, message } = req.body;
    const existing = await Match.findOne({
      $or: [
        { requester: req.user._id, receiver: receiverId },
        { requester: receiverId, receiver: req.user._id },
      ],
    });
    if (existing) return res.status(400).json({ message: "Match request already exists" });

    const match = await Match.create({
      requester: req.user._id,
      receiver: receiverId,
      requesterSkill,
      receiverSkill,
      message,
    });
    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
    })
      .populate("requester", "name avatar rating skillsOffered")
      .populate("receiver", "name avatar rating skillsOffered")
      .sort({ updatedAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    if (match.receiver.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    match.status = status;
    await match.save();
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
