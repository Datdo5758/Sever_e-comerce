const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const userControllers = require("../controllers/user");
const router = express.Router();

router.put(
  "/signup",
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("E-mail address already exists!");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty(),

  userControllers.signup
);
router.post("/login", userControllers.login);
router.post("/logout", userControllers.logout);
router.post("/admin/login", userControllers.loginAdmin);

module.exports = router;
