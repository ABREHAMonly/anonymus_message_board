const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    text: { type: String, required: true },
    imageUrl: { type: String }, // This stores the path to the uploaded image
    timestamp: { type: Date, default: Date.now },
    reactions: {
        true: { type: Number, default: 0 },   // thumbs up
        false: { type: Number, default: 0 },  // thumbs down
        love: { type: Number, default: 0 },   // love
    }
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
