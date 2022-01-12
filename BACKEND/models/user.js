const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, required: true },
  passwordHash: { type: String, require: true },
  street: { type: String, default: "" },
  apartment: { type: String, default: "" },
  city: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

// from here to row 23, we use this to change the id. From _id to id(more user friendly)
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
