const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");

// Get List of All Products
router.get("/", async (req, res) => {
  const productList = await Product.find().select("name image -_id"); // With Select method we can tell the exact info we want to get. | -_id | means we dont want Id of the product to be returned. with '-' we exclude.
  res.send(productList);
});

// Get Only one Product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category"); // Populate will give us the information for the connected document

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

// router.get("/:id", async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     res.status(500).json({ success: false });
//   }
//   res.send(product);
// });

// Create a Product
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
