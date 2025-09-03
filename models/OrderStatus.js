const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
