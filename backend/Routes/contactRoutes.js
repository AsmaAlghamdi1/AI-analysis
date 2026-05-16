const express = require("express");
const router = express.Router();

const contactController = require("../controller/contactController");

router.post("/", contactController.submitContact);

module.exports = router;