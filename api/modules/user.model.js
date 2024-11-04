const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, },
    phone: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },//encrypted
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    address: { type: addressSchema },
    payment_card: { type: String },//encrypted
    _active: { type: Boolean, default: true, }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    return
});

const user_module = mongoose.model('user', userSchema);

module.exports = user_module;
