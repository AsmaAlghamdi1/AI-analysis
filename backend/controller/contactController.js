const contactService = require("../services/contactService");

async function submitContact(req, res) {
  try {
    const { fullname, email, subject, message } = req.body;

    await contactService.saveContact(fullname, email, subject, message);

    res.status(200).json({
      message: "The data has been received successfully.",
    });
  } catch (err) {
    console.error("Error while entering data:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  submitContact,
};