const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is weak");
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "photoUrl",
    "gender",
    "about",
  ];

  isAllowed = Object.keys(req.body).every((k) => allowedFields.includes(k));

  return isAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
