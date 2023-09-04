const express = require("express");
const orderControllers = require("../controllers/order");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/order", auth.clients, orderControllers.postOrder);
router.get("/orders/:userId", orderControllers.getOrderUser);
router.get("/order/:orderId", orderControllers.getAOrderUser);

module.exports = router;
