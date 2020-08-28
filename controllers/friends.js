// INCLUDES
const User = require("../models/user");

module.exports.getFriends = async (req, res, next) => {
  const user = req.username;

  const DBUser = await User.findOne({ username: user });

  res.status(200).json(DBUser.friends);
};
