const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

require("dotenv").config();

const cloudName = process.env.CLOUD_NAME;
const apiKey = process.env.API_KEY_CLOUD;
const apiSecret = process.env.API_SECRET_CLOUD;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

exports.getAllOrder = (req, res, next) => {
  Order.find()
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
};

exports.getAllUser = (req, res, next) => {
  User.find({ role: "client" })
    .then(result => res.status(200).json(result.length))
    .catch(err => console.log(err));
};

exports.postNewProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: error });
  }

  const data = req.body;
  const images = req.files;
  if (!req.files || !images || images.length !== 4) {
    return res
      .status(422)
      .json({ errors: ["Chỉ được gửi 4 hình ảnh cho sản phẩm"] });
  }

  // Lưu tất cả các URL ảnh đã tải lên Cloudinary
  const imageUrls = [];

  try {
    for (const image of images) {
      const response = await cloudinary.uploader.upload(image.path, {
        folder: "images",
      });

      if (response.secure_url) {
        imageUrls.push(response.secure_url);
      }
    }

    const product = new Product({
      name: data.name,
      price: data.price,
      category: data.category,
      long_desc: data.long_desc,
      short_desc: data.short_desc,
      count: data.count,
      img1: imageUrls[0],
      img2: imageUrls[1],
      img3: imageUrls[2],
      img4: imageUrls[3],
    });

    product
      .save()
      .then(result =>
        res.status(200).json({ message: "Thêm sản phẩm thành công!" })
      )
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (error) {
    console.log("Lỗi khi tải lên hình ảnh lên Cloudinary:", error);
    return res
      .status(500)
      .json({ errors: "Lỗi khi tải lên hình ảnh lên Cloudinary." });
  }
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(result => res.status(200).json(result))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: error });
  }
  const prodId = req.params.prodId;
  const newData = req.body;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        res.status(500).json({ mesage: "sản phẩm không tồn tại" });
      }
      product.name = newData.name;
      product.price = newData.price;
      product.category = newData.category;
      product.long_desc = newData.long_desc;
      product.short_desc = newData.short_desc;
      product.count = newData.count;
      return product.save();
    })
    .then(result => {
      res.status(200).json({ message: "updated!", product: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error("Could not find product.");
        error.statusCode = 404;
        throw error;
      }

      return Product.findByIdAndRemove(productId);
    })
    .then(result => {
      res.status(200).json({ message: "Delete" });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, err => console.log(err));
};
