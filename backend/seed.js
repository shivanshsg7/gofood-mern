const mongoose = require('mongoose');
const FoodItem = require('./models/food_items');   // make sure model path is correct
const Category = require('./models/categories');   // make sure model path is correct

// Replace with your own MongoDB URI
const mongoURI = 'mongodb+srv://shivanshsg7:kJtkLCzdxWWq18NP@cluster0.ey5hiuf.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0';

// Categories
const sampleCategories = [
  { CategoryName: 'Pizza' },
  { CategoryName: 'Burger' },
  { CategoryName: 'Dessert' },
  { CategoryName: 'Drinks' }
];

// Food Items (4–5 in each category)
const sampleFoodItems = [
  // 🍕 Pizza
  {
    name: 'Margherita Pizza',
    img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
    options: [{ Regular: 199, Medium: 299, Large: 399 }],
    description: 'Classic cheese pizza with tomato sauce.',
    CategoryName: 'Pizza'
  },
  {
    name: 'Farmhouse Pizza',
    img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
    options: [{ Regular: 249, Medium: 349, Large: 449 }],
    description: 'Loaded with fresh veggies like capsicum, onion, tomato & mushrooms.',
    CategoryName: 'Pizza'
  },
  {
    name: 'Pepperoni Pizza',
    img: 'https://images.unsplash.com/photo-1601924582971-3ccf4be9f4df?auto=format&fit=crop&w=800&q=80',
    options: [{ Regular: 299, Medium: 399, Large: 499 }],
    description: 'Cheesy delight topped with pepperoni slices.',
    CategoryName: 'Pizza'
  },
  {
    name: 'Paneer Tikka Pizza',
    img: 'https://images.unsplash.com/photo-1628840042765-356f96b05da6?auto=format&fit=crop&w=800&q=80',
    options: [{ Regular: 259, Medium: 359, Large: 459 }],
    description: 'Spicy paneer chunks with onion and capsicum.',
    CategoryName: 'Pizza'
  },
  {
    name: 'Cheese Burst Pizza',
    img: 'https://images.unsplash.com/photo-1601924582980-1232c8a09b8a?auto=format&fit=crop&w=800&q=80',
    options: [{ Regular: 279, Medium: 379, Large: 479 }],
    description: 'Pizza with molten cheese oozing from the crust.',
    CategoryName: 'Pizza'
  },

  // 🍔 Burger
  {
    name: 'Veggie Burger',
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    options: [{ Single: 99, Double: 149 }],
    description: 'Burger with fresh veggies and patty.',
    CategoryName: 'Burger'
  },
  {
    name: 'Cheese Burger',
    img: 'https://images.unsplash.com/photo-1606756792469-93d40eab1801?auto=format&fit=crop&w=800&q=80',
    options: [{ Single: 129, Double: 179 }],
    description: 'Juicy burger with melted cheese slice.',
    CategoryName: 'Burger'
  },
  {
    name: 'Paneer Burger',
    img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    options: [{ Single: 149, Double: 199 }],
    description: 'Crispy paneer patty inside a soft bun.',
    CategoryName: 'Burger'
  },
  {
    name: 'Double Patty Burger',
    img: 'https://images.unsplash.com/photo-1601924582971-3ccf4be9f4df?auto=format&fit=crop&w=800&q=80',
    options: [{ Regular: 199, Large: 249 }],
    description: 'Two patties stacked with cheese & sauces.',
    CategoryName: 'Burger'
  },
  {
    name: 'Crispy Chicken Burger',
    img: 'https://images.unsplash.com/photo-1627308595335-26a5be62d2f5?auto=format&fit=crop&w=800&q=80',
    options: [{ Single: 179, Double: 229 }],
    description: 'Crispy chicken patty with spicy mayo.',
    CategoryName: 'Burger'
  },

  // 🍰 Dessert
  {
    name: 'Chocolate Cake',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    options: [{ Slice: 79, Full: 499 }],
    description: 'Rich chocolate cake for dessert lovers.',
    CategoryName: 'Dessert'
  },
  {
    name: 'Brownie',
    img: 'https://images.unsplash.com/photo-1612197527762-07b9a59ef29f?auto=format&fit=crop&w=800&q=80',
    options: [{ Single: 59, WithIceCream: 129 }],
    description: 'Chocolate brownie served warm, goes great with ice cream.',
    CategoryName: 'Dessert'
  },
  {
    name: 'Ice Cream Sundae',
    img: 'https://images.unsplash.com/photo-1505253216365-5cbe5d2ed9a0?auto=format&fit=crop&w=800&q=80',
    options: [{ Small: 99, Large: 159 }],
    description: 'Layers of ice cream, nuts, syrup & whipped cream.',
    CategoryName: 'Dessert'
  },
  {
    name: 'Gulab Jamun',
    img: 'https://images.unsplash.com/photo-1626082892350-7887e6443da0?auto=format&fit=crop&w=800&q=80',
    options: [{ "2Pieces": 49, "5Pieces": 119 }],
    description: 'Soft fried dough balls soaked in sugar syrup.',
    CategoryName: 'Dessert'
  },
  {
    name: 'Cheesecake',
    img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    options: [{ Slice: 129, Full: 599 }],
    description: 'Smooth and creamy cheesecake with biscuit base.',
    CategoryName: 'Dessert'
  },

  // 🥤 Drinks
  {
    name: 'Coke',
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80',
    options: [{ Small: 39, Medium: 59, Large: 79 }],
    description: 'Chilled soft drink to refresh you.',
    CategoryName: 'Drinks'
  },
  {
    name: 'Pepsi',
    img: 'https://images.unsplash.com/photo-1601924582971-3ccf4be9f4df?auto=format&fit=crop&w=800&q=80',
    options: [{ Small: 39, Medium: 59, Large: 79 }],
    description: 'Refreshing carbonated soft drink.',
    CategoryName: 'Drinks'
  },
  {
    name: 'Cold Coffee',
    img: 'https://images.unsplash.com/photo-1627647225477-4d3a9f67b6d9?auto=format&fit=crop&w=800&q=80',
    options: [{ Small: 79, Medium: 119, Large: 159 }],
    description: 'Iced coffee with a creamy texture.',
    CategoryName: 'Drinks'
  },
  {
    name: 'Mojito',
    img: 'https://images.unsplash.com/photo-1627328710303-3caa2d05f95b?auto=format&fit=crop&w=800&q=80',
    options: [{ Regular: 99, Large: 149 }],
    description: 'Minty lime drink, served chilled.',
    CategoryName: 'Drinks'
  },
  {
    name: 'Orange Juice',
    img: 'https://images.unsplash.com/photo-1558640476-437a1f1ef8cd?auto=format&fit=crop&w=800&q=80',
    options: [{ Glass: 79, Bottle: 149 }],
    description: 'Freshly squeezed orange juice.',
    CategoryName: 'Drinks'
  }
];

// Seeder function
async function seedDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Insert categories
    await Category.deleteMany({});
    await Category.insertMany(sampleCategories);
    console.log('✅ Categories seeded');

    // Insert food items
    await FoodItem.deleteMany({});
    await FoodItem.insertMany(sampleFoodItems);
    console.log('✅ Food items seeded');

    mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();
