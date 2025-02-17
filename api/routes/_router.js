const mainRouter = require("./_main.route")
const categoryRouter = require("./category.router")
const productRouter = require("./product.router")
const userRouter = require("./user.route")
const wishlistRouter = require("./wishlist.route")

const Routes = [
    mainRouter,
    userRouter,
    productRouter,
    categoryRouter,
    wishlistRouter,
]

module.exports = Routes
