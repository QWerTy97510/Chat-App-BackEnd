// INCLUDES
const User = require("../models/user");
const mySocket = require("../socket");

module.exports.getFriendRequests = async (req, res, next) => {
  try {
    const userParam = req.username;
    const user = await User.findOne({ username: userParam });

    res.status(200).json({ data: user.friendRequests });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getSendFriendRequest = async (req, res, next) => {
  const user = req.username;
  const requestTo = req.params.requestTo;

  try {
    const DBRequestTo = await User.findOne({ username: requestTo });
    if (
      DBRequestTo.friendRequests.indexOf(user) === -1 &&
      DBRequestTo.friends.indexOf(user) === -1
    ) {
      DBRequestTo.friendRequests.push(user);
      const response = await DBRequestTo.save();

      const socket = mySocket.getIO();
      socket.emit("gotFriendRequest", { user });

      res
        .status(201)
        .json({ message: "Friend request sent", response: response });
    } else {
      res.status(403).json({
        message: `You already sent a friend request to ${requestTo} or you have it in your list of friends!`,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAcceptFriendRequest = async (req, res, next) => {
  const user = req.username;
  const acceptTo = req.params.acceptTo;

  try {
    const DBUser = await User.findOne({ username: user });
    const DBAcceptTo = await User.findOne({ username: acceptTo });

    DBUser.friends.push(acceptTo);
    DBAcceptTo.friends.push(user);

    const DBUserUpdatedFriendRequest = DBUser.friendRequests.filter(
      (fr) => fr !== acceptTo
    );
    DBUser.friendRequests = DBUserUpdatedFriendRequest;

    const responseUser = await DBUser.save();
    const responseAcceptTo = await DBAcceptTo.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getRejectFriendRequest = async (req, res, next) => {
  const user = req.username;
  const rejectTo = req.params.rejectTo;

  try {
    const DBUser = await User.findOne({ username: user });
    const DBUserUpdatedFriendRequest = DBUser.friendRequests.filter(
      (fr) => fr !== rejectTo
    );

    DBUser.friendRequests = DBUserUpdatedFriendRequest;
    const response = await DBUser.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    console.log(err);
  }
};
