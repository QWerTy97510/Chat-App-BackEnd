// INCLUDES
const authController = require("../controllers/auth");
const { body } = require("express-validator");

// MODELS
const User = require("../models/user");

// CREATING THE ROUTER
const router = require("express").Router();

router.post(
  "/signup",
  [
    body("email", "Plesae enter a valid email address")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "The password should be at least 6 characters long")
      .trim()
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body("username")
      .trim()
      .isLength({ min: 5 })
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          console.log(user);
          const error = new Error("This User Already Exist");
          error.statusCode = 403;
          throw error;
        }
      }),
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    body("password", "The password should be at least 6 characters long")
      .trim()
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body("username")
      .trim()
      .isLength({ min: 5 })
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (!user) {
          const error = new Error("This User Cannot Be Found");
          error.statusCode = 403;
          throw error;
        }
      })
      .withMessage("This username could not be found"),
  ],
  authController.postLogin
);

router.get("/logout", authController.getLogout);

router.get("/refreshToken/:refreshToken", authController.getRefreshToken);

module.exports = router;
