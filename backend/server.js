const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storyRoutes = require('./routes/storyRoutes'); // Add story routes

// Configure dotenv and database connection
dotenv.config();
connectDB();



// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({
  origin: 'https://anonymus-message-board.vercel.app',
  credentials: true
}));
app.use(express.json());


// Define API routes
app.use('/api/messages', messageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stories', storyRoutes); // Add story routes

// You can also use `upload.single('image')` in specific routes where image upload is required, such as in your `storyRoutes`

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
