import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  try {
    const { matchId, scheduledAt, duration, topic, meetingLink } = req.body;
    const session = await Session.create({
      matchId,
      scheduledBy: req.user._id,
      scheduledAt,
      duration,
      topic,
      meetingLink,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const Match = (await import("../models/Match.js")).default;
    const myMatches = await Match.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
      status: "accepted",
    });
    const matchIds = myMatches.map((m) => m._id);

    const sessions = await Session.find({ matchId: { $in: matchIds } })
      .populate({ path: "matchId", populate: [{ path: "requester", select: "name avatar" }, { path: "receiver", select: "name avatar" }] })
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
