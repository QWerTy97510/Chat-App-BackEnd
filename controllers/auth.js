// INCLUDES
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken");
const mySocket = require("../socket");

// MODELS
const User = require("../models/user");
const router = require("../routes/auth");

module.exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Problems During SignUp Process...");
    error.statusCode = 403;
    res.status(403).send({ message: "Error" });
    throw error;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      username: username,
      password: hashedPassword,
    });

    const createdUser = await user.save();

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    const newRefreshToken = new RefreshToken({
      refreshToken: refreshToken,
      belongsTo: username,
    });

    const resultSaveNewRefreshToken = await newRefreshToken.save();

    return res.status(201).json({ message: "User created", user: createdUser });
  } catch (err) {
    console.log(err);
  }
};

module.exports.postLogin = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Problems Trying to LogIn");
      error.statusCode = 403;
      res.status(403).json({
        message: "Problems Trying to LogIn! Please try again later",
        status: error.statusCode,
      });
      throw error;
    }

    const user = await User.findOne({ username: username });

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      const error = new Error("Password incorrect");
      error.statusCode = 403;
      res.status(403).json({
        message: "Incorrect Password",
        status: error.statusCode,
      });
      throw error;
    }

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY_TOKEN,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = await RefreshToken.findOne({
      belongsTo: user.username,
    });

    res.setHeader("Authorization", accessToken);

    return res.status(200).json({
      message: "LoggedIn Successfully",
      token: accessToken,
      tokenExpiresAt: Date.now() + 300000,
      refreshToken: refreshToken,
      username: user.username,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getLogout = async (req, res, next) => {
  const refreshToken = req.get("Logout-Token");

  return res.status(200);
};

module.exports.getRefreshToken = async (req, res, next) => {
  const refreshToken = req.params.refreshToken;

  const existRefreshToken = await RefreshToken.findOne({
    refreshToken: refreshToken,
  });
  if (!existRefreshToken)
    return res.status(401).send("Refresh Token not Found");

  jwt.verify(
    refreshToken,
    process.env.SECRET_KEY_REFRESH_TOKEN,
    (err, decoded) => {
      if (err) return res.status(403);

      const newToken = jwt.sign({ username: decoded.username }, "secret", {
        expiresIn: "5m",
      });

      return res
        .status(200)
        .json({ token: newToken, tokenExpiresAt: Date.now() + 300000 });
    }
  );
};
