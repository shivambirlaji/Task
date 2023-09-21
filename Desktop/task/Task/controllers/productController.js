const Product = require("../models/product");
const csv = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');


const seedProduct = async (req, res) => {
  try {
    const sampleProducts = [
        { name: 'Product 1', price: 10.99, quantity: 50 },
        { name: 'Product 2', price: 19.99, quantity: 30 },
        { name: 'Product 3', price: 5.99, quantity: 100 },
        { name: 'Product 4', price: 15.49, quantity: 25 },
        { name: 'Product 5', price: 8.95, quantity: 75 },
      ]
      if (!Array.isArray(sampleProducts) || sampleProducts.length === 0) {
        return res.status(400).json({ error: "Invalid input data" });
      }
      await Product.insertMany(sampleProducts)
      res.status(201).json({ msg: " product created ." });
  } catch (error) {
    console.log(error);
     res.status(500).json({ error: "An error occurred." });
  }
};
// const csvDownload = async (req, res) => {
//     try {
//         // Fetch all Product records from the database
//         const products = await Product.find();
//         // Create a CSV writer
//         const csvWriter = csv({
//           path: 'products.csv',
//           header: [
//             { id: 'Id', name: 'Name' , price : "Price" , quantity : "Quantity" },],
//         });

//         csvWriter.writeRecords(products).then(() => {
//             // Set response headers to trigger file download

//             res.setHeader('Content-Type', 'text/csv');
//             res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
//             // Stream the CSV file to the client
//             const fileStream = fs.createReadStream('products.csv');
//             fileStream.pipe(res);
//             res.send(jsonData);
//         })
      
//   } catch (error) {
//     console.log(error);
//      res.status(500).json({ error: "An error occurred." });
//   }
// };
const csvDownload = async (req, res) => {
    try {
      // Parse page and limit query parameters or use default values
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;
  
      // Calculate the skip value based on the requested page and limit
      const skip = (page - 1) * limit;
  
      // Fetch a subset of Product records with pagination
      const products = await Product.find()
        .skip(skip)
        .limit(limit);
  
      // Create a CSV writer
      const csvWriter = csv({
        path: 'products.csv',
        header: [
          { id: 'Id', name: 'Name', price: 'Price', quantity: 'Quantity' },
        ],
      });
  
      csvWriter.writeRecords(products).then(() => {
        // Set response headers to trigger file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
  
        // Stream the CSV file to the client
        const fileStream = fs.createReadStream('products.csv');
        fileStream.pipe(res);
        res.send(products)
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  };
  
// const jsonDownload = async (req, res) => {
//   try {
//     const products = await Product.find();

//     // Convert the records to JSON format
//     const jsonData = JSON.stringify(products);

//     // Set response headers to trigger file download
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Content-Disposition', 'attachment; filename=products.json');

//     // Send the JSON data as the response
//     res.send(jsonData);
//   } catch (error) {
//      res.status(500).json({ error: "An error occurred." });
//   }
// };
const jsonDownload = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Get the requested page from query parameters
      const limit = parseInt(req.query.limit) || 10; // Set a default limit per page
  
      // Calculate the skip value based on the requested page and limit
      const skip = (page - 1) * limit;
  
      // Fetch products with pagination
      const products = await Product.find()
        .skip(skip)
        .limit(limit);
  
      // Check if there are more pages
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
  
      // Convert the records to JSON format
      const jsonData = JSON.stringify(products);
  
      // Set response headers to trigger file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=products.json');
  
      // Send the JSON data as the response along with pagination information
      res.json({ data: jsonData, hasNextPage, totalPages, currentPage: page });
    } catch (error) {
      res.status(500).json({ error: "An error occurred." });
    }
  };
  
  const changePricesById = async (req, res) => {
    try {
      const { productsToUpdate } = req.body;
  
      // Input Validation
      if (!Array.isArray(productsToUpdate)) {
        return res.status(400).json({ error: "Invalid input data" });
      }
  
      let updatedCount = 0;
  
      for (const productData of productsToUpdate) {
        const { id, newPrice } = productData;
  
        // Input Validation for each product
        if (!id || !newPrice || typeof newPrice !== "number" || newPrice <= 0) {
          return res.status(400).json({ error: "Invalid input data" });
        }
  
        const product = await Product.findById(id);
  
        if (product) {
          await Product.updateOne(
            { _id: id },
            {
              $set: { price: newPrice },
            }
          );
          updatedCount++;
        }
      }
  
      res.status(201).json({ updatedCount });
    } catch (error) {
      res.status(500).json({ error: "An error occurred." });
    }
  };
  

module.exports = {
    seedProduct,
    changePricesById,
    jsonDownload,
    csvDownload 

};
