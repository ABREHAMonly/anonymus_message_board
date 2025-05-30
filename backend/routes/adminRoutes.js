// routes/adminRoutes.js
const express = require("express");
const { 
  adminLogin, 
  deleteMessage,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Protected routes
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard', admin: req.admin });
});

router.get("/verify", verifyAdmin, (req, res) => {
    res.status(200).json({ valid: true, admin: req.admin });
  });

// Message management
router.delete("/message/:id", verifyAdmin, deleteMessage);

// Admin management
router.post("/admins", verifyAdmin, createAdmin);
router.get("/admins", verifyAdmin, getAllAdmins);
router.put("/admins/:id", verifyAdmin, updateAdmin);
router.delete("/admins/:id", verifyAdmin, deleteAdmin);

module.exports = router;