const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product_id:{type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
}, { timestamps: true });

const wishlist_module = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlist_module;