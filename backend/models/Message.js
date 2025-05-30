// models/Message.js
const mongoose = require("mongoose");

const categories = ["All","Student", "Kids", "Womens", "University","Job"];

const messageSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        user: { type: String, default: "Anonymous" },
        category: { 
            type: String, 
            required: true,
            enum: categories
        },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
        loves: { type: Number, default: 0 },   // love
        
        replies: [{
            text: { type: String, required: true },
            user: { type: String, default: "Anonymous" },
            upvotes: { type: Number, default: 0 },
            downvotes: { type: Number, default: 0 },
            loves: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);