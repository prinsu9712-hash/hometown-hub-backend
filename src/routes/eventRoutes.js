const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createEvent,
  getEvents,
  joinEvent,
  leaveEvent,
  deleteEvent,
  restoreEvent
} = require("../controllers/eventController");

// Create event (ADMIN or MODERATOR)
router.post("/", protect, authorize("ADMIN", "MODERATOR"), createEvent);

// Get events by community
router.get("/community/:communityId", protect, getEvents);

// Join event
router.post("/:id/join", protect, joinEvent);

// Leave event
router.post("/:id/leave", protect, leaveEvent);

// 🔥 Soft delete (ADMIN only)
router.put("/:id/delete", protect, authorize("ADMIN"), deleteEvent);

// 🔥 Restore (ADMIN only)
router.put("/:id/restore", protect, authorize("ADMIN"), restoreEvent);

module.exports = router;