const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  age: Number,
});

exports.User = mongoose.model("User", userSchema);
