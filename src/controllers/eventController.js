const Event = require("../models/Event");
const Community = require("../models/Community");
const Notification = require("../models/Notification");

/* ===============================
   CREATE EVENT
=============================== */
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, community } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      community,
      image: req.file ? req.file.filename : null,
      createdBy: req.user._id,
      attendees: [req.user._id]
    });

    const communityData = await Community.findById(community);

    if (communityData) {
      for (let memberId of communityData.members) {
        if (memberId.toString() !== req.user._id.toString()) {

          const notification = await Notification.create({
            user: memberId,
            message: `New event created: ${title}`,
            type: "EVENT"
          });

          // 🔥 REALTIME EMIT
          if (global.io) {
            global.io
              .to(memberId.toString())
              .emit("newNotification", notification);
          }
        }
      }
    }

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===============================
   GET EVENTS (WITH FILTER)
=============================== */
exports.getEvents = async (req, res) => {
  try {
    const { search, date } = req.query;

    let filter = {
      community: req.params.communityId,
      isDeleted: false
    };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (date) {
      filter.date = new Date(date);
    }

    const events = await Event.find(filter)
      .populate("createdBy", "name")
      .populate("attendees", "name")
      .sort({ createdAt: -1 });

    res.json(events);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===============================
   JOIN EVENT
=============================== */
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.isDeleted)
      return res.status(404).json({ message: "Event not found" });

    const alreadyJoined = event.attendees.some(
      (user) => user.toString() === req.user._id.toString()
    );

    if (alreadyJoined)
      return res.status(400).json({ message: "Already joined" });

    event.attendees.push(req.user._id);
    await event.save();

    res.json({ message: "Joined event successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===============================
   LEAVE EVENT
=============================== */
exports.leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.isDeleted)
      return res.status(404).json({ message: "Event not found" });

    event.attendees = event.attendees.filter(
      (user) => user.toString() !== req.user._id.toString()
    );

    await event.save();

    res.json({ message: "Left event successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};