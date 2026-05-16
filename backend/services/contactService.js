const contactModel = require("../Models/contactModel");

function saveContact(fullname, email, subject, message) {
  return new Promise((resolve, reject) => {
    contactModel.createContact(fullname, email, subject, message, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  saveContact,
};