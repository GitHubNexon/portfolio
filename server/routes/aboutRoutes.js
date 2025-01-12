const express = require("express");
const router = express.Router();

const {
  createAbout,
  getAllAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/AboutController");

// POST route to create About section
router.post("/", createAbout);

// GET route to fetch all About sections
router.get("/getAll", getAllAbout);

// PATCH route to update an existing About section
router.patch("/update/:id", updateAbout);

// DELETE route to remove an About section
router.delete("/delete/:id", deleteAbout);

module.exports = router;
