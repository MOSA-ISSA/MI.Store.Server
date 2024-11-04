const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
    images: [String],  // Array of image URLs
},{ timestamps: true });

const product_module = mongoose.model("product", productSchema);

module.exports = product_module;