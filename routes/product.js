const express = require("express");
const productControllers = require("../controllers/product");
const router = express.Router();

router.get("/products", productControllers.getProducts);
router.get("/product/:prodId", productControllers.getProduct);

module.exports = router;
