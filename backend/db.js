const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://shivanshsg7:kJtkLCzdxWWq18NP@cluster0.ey5hiuf.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI); // useNewUrlParser is deprecated and can be removed

    console.log('✅ Connected to MongoDB successfully');

    // Fetch food_items
    const foodItemsCollection = await mongoose.connection.db.collection('food_items');
    const foodItemsData = await foodItemsCollection.find({}).toArray();
    global.food_items = foodItemsData;
    console.log('🍔 Food items fetched and stored in global.food_items');
    // console.log("Global Food Items (first few):", global.food_items.slice(0, 3)); // Log a subset to avoid overwhelming console

    // Fetch foodCategory
    const foodCategoryCollection = await mongoose.connection.db.collection('foodCategory');
    const foodCategoryData = await foodCategoryCollection.find({}).toArray();
    global.foodCategory = foodCategoryData;
    console.log('📦 Food categories fetched and stored in global.foodCategory');
    // console.log("Global Food Categories:", global.foodCategory);

  } catch (err) {
    console.error('❌ Error connecting or fetching data:', err);
    throw err; // Re-throw the error so the server doesn't start if connection fails
  }
};

module.exports = mongoDB;