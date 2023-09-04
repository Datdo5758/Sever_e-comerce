const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => console.log(err));
};
