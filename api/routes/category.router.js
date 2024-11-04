const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/category.controller");

categoryRouter.get("/getAllCategories", categoryController.getAllCategories);
categoryRouter.post("/addCategory", categoryController.addCategory);

module.exports = categoryRouter;