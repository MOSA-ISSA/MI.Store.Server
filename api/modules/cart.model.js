const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
}, { timestamps: true });

const cart_module = mongoose.model("Cart", cartSchema);
module.exports = cart_module;