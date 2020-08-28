const router = require("express").Router();
const friendSearchController = require("../controllers/friendSearch");

router.get("/:searchUser", friendSearchController.getSearchUser);

module.exports = router;
