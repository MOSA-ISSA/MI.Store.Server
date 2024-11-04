const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
    }],
},{ timestamps: true });

const wishlist_module = mongoose.model("Wishlist", wishlistSchema);
module.exports = wishlist_module;