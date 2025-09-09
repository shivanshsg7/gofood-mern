const { getFoodData: getDbData } = require('../db');

async function getFoodData(req, res) {
  try {
    const { food_items, food_categories } = getDbData();
    console.log(`Responding to /api/foodData. Items: ${food_items?.length || 0}, Categories: ${food_categories?.length || 0}`);
    return res.json([food_items, food_categories]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
}

module.exports = {
  getFoodData,
};

