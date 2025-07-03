const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { connection } = require("mongoose");

router.post("/request/send/:status/:userid", authUser, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userid;
    const status = req.params.status;

    const allowedStatus = ["ignore", "interested"];

    if (!allowedStatus.includes(status)) {
      throw new Error(
        `status must be one of the following: ${allowedStatus.join(", ")}`
      );
    }

    const user = await User.findById({ _id: toUserId });

    if (!user) {
      throw new Error(`User with ID ${toUserId} does not exist`);
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: fromUserId,
          toUserId: toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingRequest) {
      throw new Error(
        `Connection request already exists between user ${fromUserId} and user ${toUserId}`
      );
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: `${req.user.firstName} is ${status} in ${user.firstName}`,
      data: data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error(
          `status must be one of the following: ${allowedStatus.join(", ")}`
        );
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error(
          `Connection request with ID ${requestId} does not exist or is not in the interested state`
        );
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: `You have ${status} the connection request from user ${connectionRequest.firstName}`,
        data: data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);



module.exports = router;
