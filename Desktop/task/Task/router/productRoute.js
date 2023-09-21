const express = require("express");
const productController = require ("../controllers/productController")

const router = new express.Router()


router.post("/product", productController.seedProduct );
router.get("/csv/download", productController.csvDownload);
router.get("/json/download", productController.jsonDownload);
router.put("/update/prices", productController.changePricesById);


module.exports = router