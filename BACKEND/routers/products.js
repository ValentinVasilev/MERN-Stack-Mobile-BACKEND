const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");

// Get List of All Products
router.get("/", async (req, res) => {
  // const productList = await Product.find().select("name image -_id"); // With Select method we can tell the exact info we want to get. | -_id | means we dont want Id of the product to be returned. with '-' we exclude.
  const productList = await Product.find();
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

router.put("/:id", async (req, res) => {
  //Here we Validate if the Id is correct object.
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product Id");
  }

  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
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
    },
    {
      new: true,
    }
  );

  if (!product) {
    res.status(400).json({ message: "The Product cannot be Updated" });
  }

  res.send(product);
});

router.delete("/:id", async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: `The product is deleted!`,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `Product not found!`,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
module.exports = router;