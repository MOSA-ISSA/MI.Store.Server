const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
    // address: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name'],
        minlength: 2,
        maxlength: 20,
        match: /^[a-zA-Z]+( [a-zA-Z]+)*$/ // validation make it clear in the ui
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is not valid'],
        lowercase: true,
        trim: true,
    },
    // phone: {
    //     type: String,
    //     required: [true, 'please enter your phone number'],
    //     // unique: [true, 'This phone number already exists'],
    //     minlength: 9,
    //     maxlength: 15,
    //     // match: validatePhone later
    // },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 16,
        // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,for strong password withe 
        /*
          *  At least 8 characters
          *  At least one uppercase letter
          *  At least one lowercase letter
          *  At least one number
          *  At least one special character
        */
    },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    address: { type: addressSchema },
    _active: { type: Boolean, default: false, }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    return
});

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('This email already exists.'));
    } else {
        next(error);
    }
});

const user_module = mongoose.model('user', userSchema);

module.exports = user_module;
