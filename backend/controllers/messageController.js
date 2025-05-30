const Message = require("../models/Message");
const checkToxicity = require("../utils/toxicityFilter");

// Get all messages, sorted by latest
const getMessages = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        
        const messages = await Message.find(filter)
            .sort({ createdAt: -1 });
            
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Message.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Post a new message with AI toxicity filtering
const postMessage = async (req, res) => {
    try {
        const { text, category } = req.body;
        if (!text || !category) {
            return res.status(400).json({ error: "Message and category are required." });
        }

        // Check for toxicity
        const isToxic = await checkToxicity(text);
        if (isToxic) {
            return res.status(400).json({ error: "Your message contains toxic content and cannot be posted." });
        }

        const randomUser = `User${Math.floor(1000 + Math.random() * 9000)}`;
        const newMessage = new Message({ text, category, user: randomUser, upvotes: 0, downvotes: 0, loves: 0 });

        await newMessage.save();
        res.status(201).json({ message: "Message posted successfully!", data: newMessage });
    } catch (error) {
        console.error("Error posting message:", error);
        res.status(500).json({ error: "Failed to post message. Please try again later." });
    }
};

// Upvote or downvote a message
const voteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { vote } = req.body; // "upvote" or "downvote"

        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ error: "Message not found." });

        if (vote === "upvote") {
            message.upvotes += 1;
        } else if (vote === "downvote") {
            message.downvotes += 1;
        } 
        else if (vote === "love") {
            message.loves += 1;
        } else {
            return res.status(400).json({ error: "Invalid vote type. Use 'upvote' or 'downvote'." });
        }

        await message.save();
        res.json({ message: "Vote recorded successfully!", data: message });
    } catch (error) {
        console.error("Error voting on message:", error);
        res.status(500).json({ error: "Vote failed. Please try again later." });
    }
};

// Add this at the top of messageController.js
const validateMessage = (text) => {
    if (!text || text.trim().length === 0) {
        return { valid: false, error: "Message cannot be empty." };
    }

    if (text.length > 700) {
        return { valid: false, error: "Message is too long (max 700 characters)." };
    }

    const repeatedPattern = /(.)\1{6,}|(\b\w+\b)(\s+\2){3,}/i;
    if (repeatedPattern.test(text)) {
        return { valid: false, error: "Message appears to be spam." };
    }

    const linkPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
    const safeDomains = ["example.com", "trustedsite.org", "securepage.net"];
    const containsUnsafeLink = linkPattern.test(text) && !safeDomains.some(domain => text.includes(domain));
    if (containsUnsafeLink) {
        return { valid: false, error: "Only secure and trusted links are allowed." };
    }

    const inappropriateWords = ["sex", "porn", "nude", "xxx", "fuck", "bitch", "dick", "pussy", "asshole", "slut","ወሲብ","የወሲብ","ምስ","እምስ","ቁላ","መብዳት","ጀላ","ስለወሲብ","ሹገር","ሹገርማሚ","ሹገር ማሚ","መበዳት"];
    const containsInappropriateWord = inappropriateWords.some(word => text.toLowerCase().includes(word));
    if (containsInappropriateWord) {
        return { valid: false, error: "Message contains inappropriate content." };
    }

    return { valid: true };
};

// Then modify your addReply function to use this:
const addReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        // Use the validation function
        const validation = validateMessage(text);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Rest of your existing addReply logic...
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Toxicity check (make sure checkToxicity is imported)
        const isToxic = await checkToxicity(text);
        if (isToxic) {
            return res.status(400).json({ error: "Reply contains toxic content" });
        }

        const newReply = {
            text: text.trim(),
            user: `User${Math.floor(1000 + Math.random() * 9000)}`,
            upvotes: 0,
            downvotes: 0,
            loves: 0
        };

        message.replies.push(newReply);
        await message.save();

        res.status(201).json(newReply);
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ error: "Failed to add reply. Please try again later." });
    }
};

const voteReply = async (req, res) => {
    try {
        const { id, replyId } = req.params;
        const { vote } = req.body;
        const validVotes = ["upvote", "downvote", "love"];

        if (!validVotes.includes(vote)) {
            return res.status(400).json({ error: "Invalid vote type" });
        }

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        const reply = message.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ error: "Reply not found" });
        }

        // Update the appropriate vote count
        if (vote === "upvote") reply.upvotes += 1;
        if (vote === "downvote") reply.downvotes += 1;
        if (vote === "love") reply.loves += 1;

        await message.save();
        res.json(reply);
    } catch (error) {
        console.error("Error voting on reply:", error);
        res.status(500).json({ error: "Failed to process vote. Please try again later." });
    }
};

module.exports = { 
    getMessages, 
    getCategories,
    postMessage, 
    voteMessage,
    addReply,
    voteReply
};