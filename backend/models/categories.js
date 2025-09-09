const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  CategoryName: String
});

module.exports = mongoose.model('foodcategories', CategorySchema);

