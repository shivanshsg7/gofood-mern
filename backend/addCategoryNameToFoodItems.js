// Script to add CategoryName to each food item in the food_items collection
const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://shivanshsg7:kJtkLCzdxWWq18NP@cluster0.ey5hiuf.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0';

// Simple mapping based on item name keywords
const categoryMap = [
  { name: 'Pizza', keywords: ['Pizza'] },
  { name: 'Burger', keywords: ['Burger'] },
  { name: 'Dessert', keywords: ['Cake', 'Brownie', 'Ice Cream', 'Gulab Jamun', 'Cheesecake'] },
  { name: 'Drinks', keywords: ['Coke', 'Pepsi', 'Coffee', 'Mojito', 'Juice'] }
];

function inferCategory(itemName) {
  for (const cat of categoryMap) {
    for (const keyword of cat.keywords) {
      if (itemName.toLowerCase().includes(keyword.toLowerCase())) {
        return cat.name;
      }
    }
  }
  return null;
}

async function addCategoryNameToFoodItems() {
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const foodItems = await db.collection('food_items').find({}).toArray();
  let updatedCount = 0;

  for (const item of foodItems) {
    if (!item.CategoryName) {
      const inferred = inferCategory(item.name);
      if (inferred) {
        await db.collection('food_items').updateOne(
          { _id: item._id },
          { $set: { CategoryName: inferred } }
        );
        updatedCount++;
        console.log(`Updated '${item.name}' with CategoryName '${inferred}'`);
      }
    }
  }

  console.log(`Update complete. ${updatedCount} food items updated.`);
  mongoose.disconnect();
}

addCategoryNameToFoodItems();
