const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createEvent,
  getEvents,
  joinEvent,
  leaveEvent
} = require("../controllers/eventController");

/* ==============================
   CREATE EVENT (ADMIN / MODERATOR)
============================== */

router.post(
  "/",
  protect,
  authorize("ADMIN", "MODERATOR"),
  upload.single("image"),
  createEvent
);

/* ==============================
   GET EVENTS BY COMMUNITY
============================== */

router.get("/:communityId", getEvents);

/* ==============================
   JOIN EVENT
============================== */

router.post("/:id/join", protect, joinEvent);

/* ==============================
   LEAVE EVENT
============================== */

router.post("/:id/leave", protect, leaveEvent);

module.exports = router;