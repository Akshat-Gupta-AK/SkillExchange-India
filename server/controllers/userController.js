import User from "../models/User.js";

// Get all users (for browsing/matching)
export const getUsers = async (req, res) => {
  try {
    const { skill, page = 1, limit = 12 } = req.query;
    const filter = { _id: { $ne: req.user._id } };

    if (skill) {
      filter["skillsOffered.name"] = { $regex: skill, $options: "i" };
    }

    const users = await User.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await User.countDocuments(filter);

    res.json({ users, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single user profile
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update own profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, skillsOffered, skillsWanted } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, skillsOffered, skillsWanted },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Smart match suggestions — find users whose offered skills match what you want
export const getMatchSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const wantedSkills = currentUser.skillsWanted.map((s) => s.name.toLowerCase());

    if (!wantedSkills.length)
      return res.json({ users: [], message: "Add skills you want to learn first!" });

    const suggestions = await User.find({
      _id: { $ne: req.user._id },
      "skillsOffered.name": {
        $in: wantedSkills.map((s) => new RegExp(s, "i")),
      },
    })
      .select("-password")
      .limit(10)
      .sort({ rating: -1 });

    // Score each suggestion
    const scored = suggestions.map((u) => {
      const offeredNames = u.skillsOffered.map((s) => s.name.toLowerCase());
      const myOffered = currentUser.skillsOffered.map((s) => s.name.toLowerCase());
      const theyWant = u.skillsWanted.map((s) => s.name.toLowerCase());

      let score = 0;
      wantedSkills.forEach((ws) => { if (offeredNames.includes(ws)) score += 2; });
      myOffered.forEach((mo) => { if (theyWant.includes(mo)) score += 3; }); // mutual match bonus

      return { ...u.toObject(), compatibilityScore: score };
    });

    scored.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    res.json({ users: scored });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
