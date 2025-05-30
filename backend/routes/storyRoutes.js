const express = require('express');
const upload = require('../middleware/cloudinaryUpload'); // New Cloudinary upload middleware
const { uploadStory, getStories, addReaction } = require('../controllers/storyController');

const router = express.Router();

// POST route for uploading story (with image upload handling)
router.post('/upload', upload.single('image'), uploadStory); // Handle image upload

// GET route to fetch all stories
router.get('/all', getStories);

// POST route to add reactions to stories
router.post('/reaction', addReaction);

module.exports = router;
