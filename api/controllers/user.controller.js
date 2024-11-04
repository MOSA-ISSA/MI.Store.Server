const bcrypt = require("bcrypt");
const user_module = require("../modules/user.model");
const { add_module, get_all_module_id_names, update_module } = require("./_main.controller");

const createUser = async (req, res) => {
    console.log('req.body:', req);
    try {
        const newUser = await add_module(user_module, req, res)
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



module.exports = {
    createUser,
    getAllUsersNameId,
    login,
    updateUser,
}