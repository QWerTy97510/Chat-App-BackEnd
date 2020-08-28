// INCLUDES
const router = require("express").Router();
const friendsController = require("../controllers/friends");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, friendsController.getFriends);

module.exports = router;
