const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  likePost,
  commentPost
} = require("../controllers/postController");

router.post("/", protect, createPost);
router.get("/:communityId", getPosts);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);

module.exports = router;   // THIS LINE IS VERY IMPORTANTs