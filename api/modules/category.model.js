const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, { timestamps: true });

const category_module = mongoose.model("Category", categorySchema);
module.exports = category_module;