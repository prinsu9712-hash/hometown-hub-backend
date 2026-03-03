const User = require("../models/User");
const Community = require("../models/Community");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCommunities = await Community.countDocuments({ isDeleted: false });
    const totalEvents = await Event.countDocuments({ isDeleted: false });
    const totalNotifications = await Notification.countDocuments();

    const events = await Event.find({ isDeleted: false });
    let totalParticipants = 0;

    events.forEach(event => {
      totalParticipants += event.attendees.length;
    });

    res.json({
      totalUsers,
      totalCommunities,
      totalEvents,
      totalNotifications,
      totalParticipants
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};