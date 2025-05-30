// controllers/adminController.js
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

// Admin login function
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user with admin privileges
    const user = await User.findOne({ username, isAdmin: true });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ 
      username: user.username, 
      isAdmin: user.isAdmin,
      userId: user._id 
    }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all messages (admin only)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Delete a message (admin only)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// Admin management functions

const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const newAdmin = new User({
      username,
      password,
      isAdmin: true
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: newAdmin._id,
        username: newAdmin.username,
        isAdmin: newAdmin.isAdmin
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create admin user' 
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      admin.username = username;
    }
    
    if (password) {
      if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({ 
          error: 'Password must contain 8+ characters with uppercase and number' 
        });
      }
      admin.password = password;
    }

    await admin.save();
    
    res.status(200).json({
      message: 'Admin updated successfully',
      user: {
        id: admin._id,
        username: admin.username,
        isAdmin: admin.isAdmin
      }
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ error: 'Failed to update admin user' });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting the current admin
    if (req.admin.userId === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const deletedAdmin = await User.findOneAndDelete({ _id: id, isAdmin: true });
    
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Failed to delete admin user' });
  }
};

module.exports = {
  getAllMessages,
  adminLogin,
  deleteMessage,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin
};