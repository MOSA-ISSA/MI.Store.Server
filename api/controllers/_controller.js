const category_module = require("../modules/category.model");
const product_module = require("../modules/product.model");
const user_module = require("../modules/user.model");

const getHomeData = async (req, res) => {
    try {
        const { password, email } = req.query;
        const [products, categories] = await Promise.all(
            [product_module, category_module].map((module) => module.find({}))
        )

        const user = await user_module.findOne({ email }).then(async (user) => {
            let test = await user?.comparePassword(password);
            // console.log("test", test, "\n", user);
            return user
        })

        res?.status(200).json({
            success: true,
            products,
            categories,
            user,
        });
        return [products, categories];
    } catch (error) {
        console.error(error.message);
        res?.status(500).json({ error: error.message });
        return false
    }
}

module.exports = {
    getHomeData
}