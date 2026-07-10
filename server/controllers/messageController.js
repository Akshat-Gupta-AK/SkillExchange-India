import Message from "../models/Message.js";
import Match from "../models/Match.js";

export const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const isParticipant =
      match.requester.toString() === req.user._id.toString() ||
      match.receiver.toString() === req.user._id.toString();
    if (!isParticipant) return res.status(403).json({ message: "Not authorized" });

    const messages = await Message.find({ matchId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { matchId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { matchId, content } = req.body;
    const message = await Message.create({ matchId, sender: req.user._id, content });
    const populated = await message.populate("sender", "name avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
