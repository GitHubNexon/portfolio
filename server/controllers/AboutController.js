const About = require("../models/aboutModel.js");

async function createAbout(req, res) {
  try {
    const aboutData = req.body;

    if (!aboutData || Object.keys(aboutData).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty." });
    }
    const newAbout = new About(aboutData);

    const savedAbout = await newAbout.save();

    res.status(201).json({
      message: "About section created successfully.",
      data: savedAbout,
    });
  } catch (error) {
    console.error("Error creating about section:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

const getAllAbout = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const keyword = req.query.keyword || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;
    const date = req.query.date;

    const query = {
      ...(keyword && {
        $or: [{ "Hero.fullName": { $regex: keyword, $options: "i" } }],
      }),
      ...(date && {
        createdAt: {
          $gte: new Date(`${date}T00:00:00.000Z`),
          $lt: new Date(`${date}T23:59:59.999Z`),
        },
      }),
    };

    const sortCriteria = sortBy ? { [sortBy]: sortOrder } : {};
    const totalItems = await About.countDocuments(query);
    const about = await About.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      about,
    });
  } catch (error) {
    console.error("Error fetching about:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH method to update an existing About section
const updateAbout = async (req, res) => {
  try {
    const aboutId = req.params.id;
    const aboutData = req.body;

    if (!aboutData || Object.keys(aboutData).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty." });
    }

    const updatedAbout = await About.findByIdAndUpdate(aboutId, aboutData, {
      new: true,
    });

    if (!updatedAbout) {
      return res.status(404).json({ error: "About section not found." });
    }

    res.status(200).json({
      message: "About section updated successfully.",
      data: updatedAbout,
    });
  } catch (error) {
    console.error("Error updating about section:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// DELETE method to remove an About section
const deleteAbout = async (req, res) => {
  try {
    const aboutId = req.params.id;

    const deletedAbout = await About.findByIdAndDelete(aboutId);

    if (!deletedAbout) {
      return res.status(404).json({ error: "About section not found." });
    }

    res.status(200).json({
      message: "About deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting about section:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { createAbout, getAllAbout, updateAbout, deleteAbout };
