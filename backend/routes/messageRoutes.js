// routes/messageRoutes.js
const express = require("express");
const { 
    getMessages, 
    postMessage, 
    voteMessage,
    getCategories,
    addReply,
    voteReply
} = require("../controllers/messageController");

const router = express.Router();

// Existing routes
router.get("/", getMessages);
router.get("/categories", getCategories);
router.post("/", postMessage);
router.patch("/:id/vote", voteMessage);

// New reply routes
router.post("/:id/replies", addReply);          // Add reply to message
router.patch("/:id/replies/:replyId/vote", voteReply);  // Vote on reply

module.exports = router;