const fs = require("fs");
const analyzeService = require("../services/analyzeService");

async function analyzeDesign(req, res) {
  const imagePath = req.file?.path;
  const prompt = req.body.prompt;

  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded.",
      });
    }

    console.log("Received file:", req.file);

    const text = await analyzeService.analyzeImage(
      imagePath,
      req.file.mimetype,
      prompt
    );

    fs.unlinkSync(imagePath);

    res.json({
      result: text,
    });
  } catch (err) {
    console.error("Error in /analyze:", err.message);

    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(500).json({
      error: "Failed to analyze image.",
      details: err.message,
    });
  }
}

module.exports = {
  analyzeDesign,
};