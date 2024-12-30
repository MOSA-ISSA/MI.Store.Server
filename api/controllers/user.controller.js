const bcrypt = require("bcrypt");
const user_module = require("../modules/user.model");
const { add_module, get_all_module_id_names, update_module } = require("./_main.controller");

const createUser = async (req, res) => {
    try {
        const newUser = await add_module(user_module, req, res)
        console.log(newUser.email);
        const verificationCode = Math.floor(Math.random() * 9000) + 1000;
        const verificationEmail = await sendVerificationEmail(newUser.email, verificationCode);
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
            return res.status(404).json({ success: false, error: "User not found" });
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

const updateUser = async (req, res) => {
    return update_module(user_module, '$set', req, res)
}

const getAllUsersNameId = (req, res) => {
    return get_all_module_id_names(user_module, req, res)
}

const sendVerificationEmail = async (recipientEmail, verificationCode) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { name: "MOSA ISSA", email: "mosasenio@gmail.com" },
                to: [{ email: recipientEmail }],
                subject: "Email Verification Code",
                // htmlContent: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
                htmlContent: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <p>Your verification code is: <strong>${verificationCode}</strong></p>
                    <p>Or click the button below to verify your email:</p>
                    <a 
                    href="https://translate.google.com/" 
                    // href="https://yourdomain.com/verify-email?code=${verificationCode}&email=${recipientEmail}" 
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

module.exports = {
    createUser,
    getAllUsersNameId,
    login,
    updateUser,
}