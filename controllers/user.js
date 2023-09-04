const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
require("dotenv").config();

// Lấy giá trị của Secret Key từ biến môi trường
const secretKeyAdmin = process.env.SECRET_KEY_ADMIN;
const secretKeyClient = process.env.SECRET_KEY;

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: error });
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const phone = req.body.phone;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
        phone: phone,
        role: "client",
        is_admin: false,
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ errors: ["Wrong password or email!"] });
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        return res.status(401).json({ errors: ["Wrong password or email!"] });
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        secretKeyClient,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
        name: loadedUser.name,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.loginAdmin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email, is_admin: true });

    if (!user) {
      return res.status(401).json({ errors: ["Wrong password or email!"] });
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(401).json({ errors: ["Wrong password or email!"] });
    }

    if (user.role === "admin") {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        secretKeyAdmin,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        email: user.email,
        userId: user._id.toString(),
        name: user.name,
      });
    } else {
      // Người dùng không phải là admin, không truyền token
      return res.status(200).json({
        email: user.email,
        userId: user._id.toString(),
        name: user.name,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = (req, res, next) => {
  // Xóa thông tin đăng nhập khỏi session
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logout successful." });
  });
};
