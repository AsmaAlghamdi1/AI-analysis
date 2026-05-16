const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const analyzeController = require("../controller/analyzeController");

router.post("/", upload.single("image"), analyzeController.analyzeDesign);

module.exports = router;