// seed.js
const sequelize = require('./db/config');
const Product = require('./model/product');

(async () => {
  try {
    await sequelize.sync({ force: true });
    await Product.bulkCreate([
      { name: 'Product 1', price: 10.99, quantity: 100 },
      { name: 'Product 2', price: 15.99, quantity: 50 },
      { name: 'Product 3', price: 5.99, quantity: 200 },
      { name: 'Product 4', price: 12.99, quantity: 75 },
      { name: 'Product 5', price: 8.99, quantity: 120 },
    ]);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
})();
