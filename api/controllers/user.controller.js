require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const user_module = require("../modules/user.model");
const { add_module, get_all_module_id_names, update_module, find_one_module } = require("./_main.controller");

const SECRET_KEY = process.env.SECRET_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const createUser = async (req, res) => {
    try {
        const newUser = await add_module(user_module, req, res)
        console.log(newUser.email);
        // const stringifyUser = JSON.stringify(newUser)
        // const EncryptUser = await bcrypt.hash(stringifyUser, 10);
        const EncryptUser = jwt.sign({ ...newUser._doc }, SECRET_KEY);
        const verificationEmail = await sendVerificationEmail(newUser.email, EncryptUser);
        console.log(verificationEmail);
        return newUser;
    } catch (e) {
        console.error(e.message);
        return null;
    }
}

const login = async (req, res) => {
    const { password, access } = req.body;
    try {
        const user = await user_module.findOne({
            $or: [{ email: access }, { phone: access }]
        });
        if (!user) {
            return res.status(404).json({ success: false, error: "mail not found" });
        }
        else if (user._active === false) {
            return res.status(403).json({ success: false, error: "user not active" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ success: false, error: "Incorrect password" });
        }
        res.status(200).json({ success: true, message: "Login successful", data: user });
    } catch (error) {
        console.error("Error in loginUser:", error.message);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

const getUser = async (req, res) => {
    return find_one_module(user_module, req, res)
}

const updateUser = async (req, res) => {
    return update_module(user_module, '$set', req, res)
}

const getAllUsersNameId = (req, res) => {
    return get_all_module_id_names(user_module, req, res)
}

const sendVerificationEmail = async (recipientEmail, EncryptUser) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { name: "MOSA ISSA", email: "mosasenio@gmail.com" },
                to: [{ email: recipientEmail }],
                subject: "Email Verification Code",
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; text-align: center;">
                        <p>Please click the button below to verify your email:</p>
                        <a 
                        href="https://canvas-48.vercel.app/Activation?token=${encodeURIComponent(EncryptUser)}"
                        style="
                            background-color: #4CAF50; 
                            color: white; 
                            padding: 10px 20px; 
                            text-decoration: none; 
                            border-radius: 5px;
                            display: inline-block;
                            margin-top: 10px;">
                        Verify Email
                        </a>
                    </div>
                `
            })
        });

        const responseData = await response.json(); // Parse response body for debugging

        if (response.ok) {
            console.log('✅ Email sent successfully:', responseData);
            return { success: true, ...responseData }
        } else {
            console.error('❌ Failed to send email:', response.status, responseData);
            return { success: false, ...responseData };
        }
    } catch (error) {
        console.error('🚨 Error:', error.message);
        return JSON.stringify(error.message);
    }
};

const activateUser = async (req, res) => {
    console.log("test", req?.body);
    return update_module(user_module, '$set', { body: { ...req?.body, updatedData: { "_active": true } } }, res);
}

const sendVerification = async (req, res) => {
    try {
        console.log(req?.body);
        const user = await user_module.findOne({ email: req?.body?.email });
        if (user) {
            const EncryptUser = jwt.sign({ ...user._doc }, SECRET_KEY);
            const result = await sendVerificationEmail(req?.body?.email, EncryptUser);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: "Email sent successfully!",
                    data: result,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Failed to send email",
                    data: result,
                });
            }
        }
        else {
            console.log("mail not found");
            res.status(403).json({ success: false, error: "mail not found" });
        }
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ success: false, error: e.message });
    }
}

module.exports = {
    createUser,
    getAllUsersNameId,
    login,
    updateUser,
    activateUser,
    sendVerification,
    sendVerificationEmail,
    getUser
}