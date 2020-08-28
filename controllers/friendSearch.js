const User = require("../models/user");

module.exports.getSearchUser = async (req, res, next) => {
  const searchUser = req.params.searchUser;

  try {
    if (searchUser === "") {
      const error = new Error("Enter somenthing");
      res.status(200).json({ users: [] });
      throw error;
    }

    const users = await User.find({
      username: { $regex: `.*${searchUser}.*` },
    });

    if (users.length === 0) {
      res.status(200).json({ message: "Users not found", users: [] });
    }

    const returnUsers = users.map((user) => {
      return { _id: user._id, username: user.username };
    });

    res.status(200).json({ message: "Users found", users: returnUsers });
  } catch (error) {
    console.log(error);
  }
};
