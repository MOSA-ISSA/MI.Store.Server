const mainRouter = require("./_main.route")
const categoryRouter = require("./category.router")
const productRouter = require("./product.router")
const userRouter = require("./user.route")

const Routes = [
    mainRouter,
    userRouter,
    productRouter,
    categoryRouter,
]

module.exports = Routes
