const categoryRouter = require("./category.router")
const productRouter = require("./product.router")
const userRouter = require("./user.route")

const Routes = [
    userRouter,
    productRouter,
    categoryRouter,
]

module.exports = Routes
