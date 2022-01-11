const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");

router.get("/", async (req, res) => {
  const productList = await Product.find();
  res.send(productList);
});

router.post("/", async (req, res) => {
  // Check if the category exist
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  });

  product.save();

  if (!product) {
    return res.status(500).send("The Product cannot be created");
  }

  res.send(product);
});

module.exports = router;
