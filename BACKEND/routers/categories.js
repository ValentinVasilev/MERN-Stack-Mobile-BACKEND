const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ message: "The Category with the given Id was not found!" });
  }

  res.status(200).send(category);
});

router.put("/:id", async (req, res) => {
  //  findByIdAndUpdate has 2 parameters, the 1st one is: /* The Id of the product */ and the second one is /* A object that contains the changed data */
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    {
      new: true, // This means that after changing the data I wan to return the newly updated data. Otherwise will give me the data that was changed(old one)
    }
  );

  if (!category) {
    res.status(400).json({ message: "The Category cannot be created" });
  }

  res.send(category);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) {
    return res.status(404).send("The Category cannot be created!");
  }

  res.send(category);
});

// api/v1/123
router.delete("/:id", async (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: `The Category is deleted!`,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `Category not found!`,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
