const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

router.post("/login", async (req, res) => {
  // First check if the user exists by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("The User not found!");
  }

  const secret = process.env.SECRET;
  // Since we have the user in our db, we check if the entered password from the user is the same as our hashed password in the db
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("Password is wrong!");
  }
});

module.exports = router;
