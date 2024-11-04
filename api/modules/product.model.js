const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String },
    images: [String],  // Array of image URLs
    category: { type: String, trim: true, ref: "Category" },
    clicks: { type: Number, default: 0 },
    userClicks: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    _active: { type: Boolean, default: true, },
}, { timestamps: true });

const product_module = mongoose.model("product", productSchema);

module.exports = product_module;