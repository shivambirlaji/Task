// app.js
const express = require("express");
const csv = require("json2csv").parse;
const fs = require("fs");
const csvParser = require("csv-parser");
const Product = require("./models/Product");
const sequelize = require("./db/config");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/downloadProductsCSV", async (req, res) => {
  try {
    // Define default values for page number and page size
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;

    // Fetch paginated products
    const products = await Product.findAll({
      limit: parseInt(pageSize),
      offset: parseInt(offset),
    });

    // Convert products to CSV format
    const csvFields = ["id", "name", "price", "quantity"];
    const csvData = json2csv.parse(products, { fields: csvFields });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.send(csvData)
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/downloadProductsJSON", async (req, res) => {
  try {
    // Define default values for page number and page size
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;

    // Fetch products with pagination
    const products = await Product.findAll({
      limit: parseInt(pageSize),
      offset: parseInt(offset),
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=products.json");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/updatePrices", async (req, res) => {
  try {
    const productsToUpdate = req.body;

    if (!Array.isArray(productsToUpdate)) {
      return res.status(400).json({
        error: "Invalid input format. Please provide an array of objects.",
      });
    }

    let updatedCount = 0;

    for (const productData of productsToUpdate) {
      const { id, newPrice } = productData;

      const product = await Product.findByPk(id);

      if (product) {
        await product.update({ price: newPrice });
        updatedCount++;
      }
    }

    res.status(200).json({ updatedCount });
  } catch (error) {
    console.error("Error updating prices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
