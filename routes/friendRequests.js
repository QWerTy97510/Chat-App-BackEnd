// INCLUDES
const router = require("express").Router();

const friendRequestController = require("../controllers/friendRequest");
const isAuth = require("../middleware/isAuth");

router.get("/getFR", isAuth, friendRequestController.getFriendRequests);

router.get(
  "/send/:requestTo",
  isAuth,
  friendRequestController.getSendFriendRequest
);

router.get(
  "/accept/:acceptTo",
  isAuth,
  friendRequestController.getAcceptFriendRequest
);

router.get(
  "/reject/:rejectTo",
  isAuth,
  friendRequestController.getRejectFriendRequest
);

module.exports = router;
