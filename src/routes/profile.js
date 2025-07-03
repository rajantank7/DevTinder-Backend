const express = require("express");
const { authUser } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const router = express.Router();

router.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("invalid data for edit profile");
    }
    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));

    await loggedinUser.save();
    res.json({
      message: ` hey ${loggedinUser.firstName} , your profile is updated successfully`,
      user: loggedinUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// router.patch("/profile/update-password", authUser, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ error: "Current and new password are required." });
//     }

//     const user = req.user;
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Current password is incorrect." });
//     }

//     const passwordHash = await bcrypt.hash(newPassword, 10);
//     user.password = passwordHash;
//     await user.save();

//     res.json({ message: "Password updated successfully." });
//   } catch (error) {
//     res.status(400).send("ERROR: " + error.message);
//   }
// });

module.exports = router;
