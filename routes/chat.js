const express = require("express");
const chatControllers = require("../controllers/chat");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/getMessageByUserId/:userId", chatControllers.getMessageByUserId);
router.post("/createNewRoom", chatControllers.createNewRoom);
router.put("/addMessage", chatControllers.addMessage);
router.get("/getAllRoom", chatControllers.getAllRoom);

module.exports = router;
