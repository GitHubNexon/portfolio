const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  Description: { type: String, required: true },
  HeroImage: { type: String, required: true },
});

const AboutSchema = new mongoose.Schema(
  {
    Hero: HeroSchema,
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", AboutSchema);
