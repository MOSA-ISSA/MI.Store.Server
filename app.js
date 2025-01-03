require('dotenv').config();
const cors = require('cors')
const express = require("express");
const mongoose = require("mongoose");
const Routes = require('./api/routes/_router');
const { sendVerificationEmail } = require('./api/controllers/user.controller');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

const mongooseLink = process.env.MI_STORE_MONGOOSE_LINK;

if (!mongooseLink) {
    console.error("Error: MI_STORE_MONGOOSE_LINK is not defined in environment variables.");
    process.exit(1);
}

mongoose.connect(mongooseLink)
    .then(() => console.log("connection successful"))
    .catch((err) => console.error("connection error:", err));

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});

mongoose.connection.on("warning", (err) => {
    console.warn("MongoDB warning:", err);
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
});

app.get('/', (req, res) => {
    res.send('server is running 🟢');
});

process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    await mongoose.connection.close();
    process.exit(0);
});

app.get('/send-verification-email', async (req, res) => {
    const result = await sendVerificationEmail("mosasenio@gmail.com", "test");
    res.status(200).json({ success: true, message: "test successful", data: result });
});

app.get('/env-test', (req, res) => {
    res.send(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? 'Loaded ✅' : 'Not Found ❌'} ${process.env.BREVO_API_KEY}`);
});

app.use("/", Routes)

module.exports = app;