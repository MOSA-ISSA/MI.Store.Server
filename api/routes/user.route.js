const express = require("express");
const userController = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/createUser", userController.createUser);
userRouter.get("/getAllUsersNameId", userController.getAllUsersNameId);
userRouter.post("/login", userController.login);
userRouter.patch("/updateUser", userController.updateUser);
userRouter.patch("/activateUser", userController.activateUser);
userRouter.post("/sendVerification", userController.sendVerification);

module.exports = userRouter;