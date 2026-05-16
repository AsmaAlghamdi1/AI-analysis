const { db } = require("../config/db");

function createContact(fullname, email, subject, message, callback) {
  const query =
    "INSERT INTO contacts(fullname, email, subject, message) VALUES (?, ?, ?, ?)";

  db.query(query, [fullname, email, subject, message], callback);
}

module.exports = {
  createContact,
};