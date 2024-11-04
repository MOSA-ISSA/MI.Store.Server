const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller");

productRouter.get("/getAllProducts", productController.getAllProducts);
productRouter.post("/addProduct", productController.addProduct);
productRouter.post("/addProducts", productController.addProducts);

module.exports = productRouter