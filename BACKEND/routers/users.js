const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models/user");

router.get("/", async (req, res) => {
  const usersList = await User.find().select("-passwordHash");
  if (!usersList) {
    res.status(500).json({ success: false });
  }
  res.send(usersList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given Id was not foudn!" });
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });

  user.save();
  if (!user) {
    return res.status(500).send("User cannot be created!");
  }
  res.send(user);
});

module.exports = router;
