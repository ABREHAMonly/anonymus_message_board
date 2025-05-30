const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadStory, getStories, addReaction } = require('../controllers/storyController');

const router = express.Router();

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique filename with extension
  },
});
const upload = multer({ storage });

// POST route for uploading story (with image upload handling)
router.post('/upload', upload.single('image'), uploadStory); // Handle image upload

// GET route to fetch all stories
router.get('/all', getStories);

// POST route to add reactions to stories
router.post('/reaction', addReaction);

module.exports = router;
