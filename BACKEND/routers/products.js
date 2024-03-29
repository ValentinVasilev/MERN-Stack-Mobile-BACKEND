const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// Multer Configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// Get List of All Products
router.get("/", async (req, res) => {
  // const productList = await Product.find().select("name image -_id"); // With Select method we can tell the exact info we want to get. | -_id | means we dont want Id of the product to be returned. with '-' we exclude.

  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category");
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
router.post("/", uploadOptions.single("image"), async (req, res) => {
  // Check if the category exist
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  // We make sure our request wont pass without a file.
  const file = req.file;
  if (!file) {
    return res.status(400).send("No image in the request!");
  }
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
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

  const product = await Product.findById(req.body.id);
  if (!product) {
    return res.status(400).send("Invalid Product");
  }

  const file = req.file;
  let imagePath;

  if (file) {
    const fileName = file.fileName;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = product.image;
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
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

  if (!updatedProduct) {
    res.status(400).json({ message: "The Product cannot be Updated" });
  }

  res.send(updatedProduct);
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

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }

  res.send({
    productCount: productCount,
  });
});

// We find only the Featured products, those are the products that has isFeatured: True
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({
    isFeatured: true,
  }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }

  res.send(products);
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("Invalid Product Id");
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  }
);

module.exports = router;
