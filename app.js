require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

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

module.exports = app;