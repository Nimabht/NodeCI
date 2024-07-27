const mongoose = require("mongoose");
const userModel = mongoose.model("User");

module.exports = async () => {
  return await userModel.create({});
};
