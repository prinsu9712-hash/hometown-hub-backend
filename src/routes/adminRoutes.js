const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

/* ==============================
   ADMIN DASHBOARD
============================== */

router.get(
  "/dashboard",
  protect,
  authorize("ADMIN"),
  getDashboardStats
);

module.exports = router;