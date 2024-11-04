const product_module = require("../modules/product.model");
const category_module = require("../modules/category.model");
const { add_module, find_modules, find_one_module, get_all_module_id_names } = require("./_main.controller")

const addProduct = async (req, res) => {
    try {
        const category = req.body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        req.body.category = category;
        const [newProduct, newCategory] = await Promise.all([
            add_module(product_module, req, res),
            category_module.findOneAndUpdate({ name: category }, { name: category }, { upsert: true, new: true }),
        ]);
        return newProduct
    } catch (e) {
        console.error(e.message);
        return null
    }
}

const addProducts = async (req, res) => {
    try {
        const products = req.body;
        const processedProducts = await Promise.all(
            products.map(async (product) => {
                const categorySlug = product.category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                const category = await category_module.findOneAndUpdate(
                    { name: categorySlug },
                    { name: categorySlug },
                    { upsert: true, new: true }
                );
                product.category = category.name;
                return product;
            })
        );
        const insertedProducts = await product_module.insertMany(processedProducts);
        res.status(200).json({ success: true, data: insertedProducts });
        return insertedProducts;
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: e.message });
        return null;
    }
};


const getAllProducts = async (req, res) => {
    try {
        const products = await find_modules(product_module, req, res);
        return products
    } catch (e) {
        console.error(e.message);
        return null
    }
}

const updateProduct = async (req, res) => {
    return update_module(product_module, '$set', req, res)
}

const getOneProduct = async (req, res) => {
    return find_one_module(product_module, req, res)
}

const getAllProductsNameId = async (req, res) => {
    return get_all_module_id_names(product_module, req, res)
}

const deleteProduct = async (req, res) => {
    // return delete_module(product_module, req, res)
}

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    addProducts,
    getOneProduct,
    getAllProductsNameId,
    deleteProduct
}