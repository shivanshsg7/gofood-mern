const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: String,
  img: String,
  options: Array,
  description: String
});

module.exports = mongoose.model('food_items', FoodItemSchema);
