const wishlist_module = require("../modules/wishlist.model")
const { add_module, delete_module, } = require("./_main.controller")


const addProductToWishlist = async (req, res) => {
    return add_module(wishlist_module, req, res)
}

const deleteProductFromWishlist = async (req, res) => {
    return delete_module(wishlist_module, req, res);
}

module.exports = {
    addProductToWishlist,
    deleteProductFromWishlist
}