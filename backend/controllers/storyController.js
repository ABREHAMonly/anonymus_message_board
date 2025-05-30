const Story = require('../models/Story');

// Controller to handle story upload (with image upload)
const uploadStory = async (req, res) => {
    try {
        const { text } = req.body;
        
        // If an image is uploaded, store its path in imageUrl
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newStory = new Story({
            text,
            imageUrl,
            timestamp: new Date(),
        });

        await newStory.save();
        res.status(200).json({ message: 'Story uploaded successfully!' });
    } catch (err) {
        console.error("Error in uploading story:", err);
        res.status(500).json({ message: 'Error uploading story' });
    }
};

// Controller to get all stories
const getStories = async (req, res) => {
    try {
        const stories = await Story.find().sort({ timestamp: -1 });
        res.status(200).json(stories);
    } catch (err) {
        console.error("Error fetching stories:", err);
        res.status(500).json({ message: 'Error fetching stories' });
    }
};

// Controller to add reactions to a story
const addReaction = async (req, res) => {
    try {
        const { storyId, reactionType } = req.body;
        const story = await Story.findById(storyId);

        if (!story) return res.status(404).json({ message: 'Story not found' });

        // Increment the selected reaction type
        if (story.reactions[reactionType] !== undefined) {
            story.reactions[reactionType] += 1;
            await story.save();
            res.status(200).json({ message: 'Reaction added successfully!' });
        } else {
            res.status(400).json({ message: 'Invalid reaction type' });
        }
    } catch (err) {
        console.error("Error in adding reaction:", err);
        res.status(500).json({ message: 'Error adding reaction' });
    }
};

module.exports = { uploadStory, getStories, addReaction };
