const express = require("express");
const adminControllers = require("../controllers/admin");
const auth = require("../middleware/auth");
const router = express.Router();
const { body } = require("express-validator");

router.get("/admin/orders", auth.admin, adminControllers.getAllOrder);

router.get("/admin/users", auth.admin, adminControllers.getAllUser);

router.post(
  "/admin/addNewProduct",
  [
    body("name")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Name phải dài hơn 5 ký tự"),
    body("long_desc")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Long description too short"),
    body("short_desc")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Short description too short"),
  ],
  auth.admin,
  adminControllers.postNewProduct
);
router.put(
  "/admin/editProduct/:prodId",
  [
    body("name")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Name phải dài hơn 5 ký tự"),
    body("long_desc")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Long description too short"),
    body("short_desc")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Short description too short"),
  ],
  auth.admin,
  adminControllers.editProduct
);

router.get("/admin/products", auth.admin, adminControllers.getProducts);
router.get("/admin/product/:prodId", auth.admin, adminControllers.getProduct);
router.delete(
  "/admin/delete/:productId",
  auth.admin,
  adminControllers.deleteProduct
);

module.exports = router;
