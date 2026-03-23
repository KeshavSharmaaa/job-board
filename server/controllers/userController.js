const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.profile || { title: "", experience: "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { title, experience } = req.body;
    
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile = {
      title: title || "",
      experience: experience || ""
    };

    await user.save();
    res.json(user.profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
