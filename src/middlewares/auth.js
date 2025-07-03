// const adminAuth = (req, res, next) => {
//   const token = "xyz";
//   const authorizedUser = "xyz" === token;
//   console.log("admin is being authorized");
//   if (!authorizedUser) {
//     res.status(401).send("admin not Authorized");
//   } else {
//     next();
//   }
// };

// const adminUser = (req, res, next) => {
//   const token = "xyz";
//   const authorizedUser = "xyz" === token;
//   console.log("admin is being authorized");
//   if (!authorizedUser) {
//     res.status(401).send("admin not Authorized");
//   } else {
//     next();
//   }
// };
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      res.status(401).send("Unauthorized: Please Login");
    }

    const decoded = await jwt.verify(token, "DevTinder@9712");

    const id = decoded._id;

    const user = await User.findById(id);
    if (!user) throw new Error("user does not exists");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = {
  // adminAuth,
  // adminUser,
  authUser,
};
