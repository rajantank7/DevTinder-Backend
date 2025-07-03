const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { set } = require("mongoose");
const User = require("../models/user");

router.get("/user/requests/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about"]);

    if (receivedRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No connection requests received." });
    }

    res.json({
      message: "Received connection requests",
      requests: receivedRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser, status: "accepted" },
        { toUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
        "age",
        "gender",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
        "age",
        "gender",
      ]);

    if (connections.length === 0) {
      return res.status(404).json({ message: "No connections found." });
    }

    const data = connections.map((ele) => {
      if (ele.fromUserId._id.toString() === loggedInUser.toString()) {
        return ele.toUserId;
      } else return ele.fromUserId;
    });

    res.json({
      message: "Your connections",
      connections: data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.get("/feed", authUser, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", "firstName")
      .populate("toUserId", "firstName");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId._id.toString());
      hideUsersFromFeed.add(req.toUserId._id.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUserId } },
      ],
    }).select("firstName lastName photoUrl about skills");
    res.send(users);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = router;
