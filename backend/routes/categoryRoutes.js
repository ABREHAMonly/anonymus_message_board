const express = require("express");
const { getCategories, createCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories); // Get all categories
router.post("/", createCategory); // Create a new category

module.exports = router;
