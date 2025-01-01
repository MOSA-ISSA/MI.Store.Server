const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller");

productRouter.get("/getAllProducts", productController.getAllProducts);
productRouter.post("/addProduct", productController.addProduct);
productRouter.post("/addProducts", productController.addProducts);
productRouter.get("/getOneProduct", productController.getOneProduct);
productRouter.get("/getAllProductsNameId", productController.getAllProductsNameId);
productRouter.delete("/deleteProduct", productController.deleteProduct);
productRouter.patch("/updateProduct", productController.updateProduct);

module.exports = productRouter