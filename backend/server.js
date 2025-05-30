const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storyRoutes = require('./routes/storyRoutes'); // Add story routes
const multer = require('multer');
const path = require('path');

// Configure dotenv and database connection
dotenv.config();
connectDB();

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Set unique filename with extension
    },
});

// Initialize Multer upload middleware
const upload = multer({ storage });

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({
  origin: 'https://anonymus-message-board.vercel.app',
  credentials: true
}));
app.use(express.json());

// Serve static files (images) from 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Define API routes
app.use('/api/messages', messageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stories', storyRoutes); // Add story routes

// You can also use `upload.single('image')` in specific routes where image upload is required, such as in your `storyRoutes`

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
