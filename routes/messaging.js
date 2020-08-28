// INCLUDES
const router = require("express").Router();
const messageControllers = require("../controllers/messaging");
const isAuth = require("../middleware/isAuth");

router.post("/send/:messagingWith", isAuth, messageControllers.postMessage);

router.get("/get/:messagingWith", isAuth, messageControllers.getMessages);

module.exports = router;
