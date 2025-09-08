async function getFoodData(req, res) {
  try {
    return res.json([global.food_items, global.foodCategory]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
}

module.exports = {
  getFoodData,
};

