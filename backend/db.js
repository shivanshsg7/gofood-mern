const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://shivanshsg7:kJtkLCzdxWWq18NP@cluster0.ey5hiuf.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0';

let food_items = [];
let food_categories = [];

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully');

    const foodItemsCollection = await mongoose.connection.db.collection('food_items');
    food_items = await foodItemsCollection.find({}).toArray();
    console.log(`🍔 Food items fetched. Count: ${food_items.length}`);

    const foodCategoryCollection = await mongoose.connection.db.collection('foodcategories');
    food_categories = await foodCategoryCollection.find({}).toArray();
    console.log(`📦 Food categories fetched. Count: ${food_categories.length}`);
  } catch (err) {
    console.error('❌ Error connecting or fetching data:', err);
    throw err;
  }
};

module.exports = {
  mongoDB,
  getFoodData: () => ({ food_items, food_categories })
};

