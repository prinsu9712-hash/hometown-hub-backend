const Community = require("../models/Community");

/* CREATE */
exports.createCommunity = async (req, res) => {
  try {
    const { name, city, description } = req.body;

    const community = await Community.create({
      name,
      city,
      description,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json({
      message: "Community created successfully",
      community
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET WITH SEARCH & FILTER */
exports.getAllCommunities = async (req, res) => {
  try {
    const { search, city } = req.query;

    let filter = { isDeleted: false };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (city) {
      filter.city = city;
    }

    const communities = await Community.find(filter)
      .populate("createdBy", "name email")
      .populate("members", "name")
      .sort({ createdAt: -1 });

    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* JOIN */
exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community || community.isDeleted)
      return res.status(404).json({ message: "Community not found" });

    if (community.members.includes(req.user._id))
      return res.status(400).json({ message: "Already a member" });

    community.members.push(req.user._id);
    await community.save();

    res.json({ message: "Joined successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* LEAVE */
exports.leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community || community.isDeleted)
      return res.status(404).json({ message: "Community not found" });

    if (community.createdBy.toString() === req.user._id.toString())
      return res.status(400).json({
        message: "Community creator cannot leave"
      });

    community.members = community.members.filter(
      user => user.toString() !== req.user._id.toString()
    );

    await community.save();

    res.json({ message: "Left community successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* SOFT DELETE */
exports.softDeleteCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community)
      return res.status(404).json({ message: "Not found" });

    community.isDeleted = true;
    await community.save();

    res.json({ message: "Community deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};