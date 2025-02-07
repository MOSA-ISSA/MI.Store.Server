const express = require("express");
const mainRouter = express.Router();
const Controller = require("../controllers/_controller");

mainRouter.get("/getHomeData", Controller.getHomeData);

module.exports = mainRouter;