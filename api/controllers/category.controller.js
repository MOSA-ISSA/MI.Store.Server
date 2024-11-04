const category_module = require("../modules/category.model")
const { add_module } = require("./_main.controller")

const addCategory = async (req, res) => {
    return add_module(category_module, req, res)
}

const getAllCategories = async (req, res) => {
    return find_modules(category_module, req, res)
}

module.exports = {
    addCategory,
    getAllCategories,
}