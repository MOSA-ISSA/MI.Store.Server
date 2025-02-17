const express = require("express");
const wishlistRouter = express.Router();
const wishlistController = require("../controllers/wishlist.controller");

wishlistRouter.post("/addProductToWishlist", wishlistController.addProductToWishlist);
wishlistRouter.delete("/deleteProductFromWishlist", wishlistController.deleteProductFromWishlist);

module.exports = wishlistRouter;