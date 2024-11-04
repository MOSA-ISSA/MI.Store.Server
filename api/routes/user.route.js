const express = require("express");
const userController = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/createUser", userController.createUser);
userRouter.get("/getAllUsersNameId", userController.getAllUsersNameId);
userRouter.post("/login", userController.login);
userRouter.patch("/updateUser", userController.updateUser);

module.exports = userRouter;