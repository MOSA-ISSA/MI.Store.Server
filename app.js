require('dotenv').config();
const cors = require('cors')
const express = require("express");
const mongoose = require("mongoose");
const Routes = require('./api/routes/_router');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const sendVerificationEmail = async (recipientEmail, verificationCode) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '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'
            },
            body: JSON.stringify({
                sender: { name: "MOSA ISSA", email: "mosasenio@gmail.com" },
                to: [{ email: recipientEmail }],
                subject: "Email Verification Code",
                htmlContent: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
            })
        });

        if (response.ok) {
            console.log('Email sent successfully!');
            return "Email sent successfully!"
        } else {
            const errorData = await response.json();
            console.error('Failed to send email:', errorData);
            return errorData
        }
    } catch (error) {
        console.error('Error:', error);
        return JSON.stringify(error)
    }
};

app.get('/test', async (req, res) => {
    const result = await sendVerificationEmail('mosasenio@gmail.com', '123456');
    res.send(result);
});

app.use("/", Routes)

// mongoose.connection.once('open', async () => {
//     try {
//         await mongoose.connection.db.collection('users').drop();
//         console.log('Collection dropped successfully');
//     } catch (err) {
//         if (err.code === 26) {
//             console.log('Collection does not exist');
//         } else {
//             console.error('Error dropping collection:', err);
//         }
//     }
// });

// mongoose.connection.once('open', async () => {
//     try {
//         const collections = await mongoose.connection.db.listCollections().toArray();
//         const collectionNames = collections.map(collection => collection.name);
//         console.log('Collections:', collectionNames);
//     } catch (err) {
//         console.error('Error retrieving collections:', err);
//     }
// });

module.exports = app;