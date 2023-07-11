const express = require("express");

const ctrl = require("../../controllers/auth");

const { authMiddlewares } = require("../../middlewares");

const router = express.Router();

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.get("/current", authMiddlewares, ctrl.getCurrent);

router.post("/logout", authMiddlewares, ctrl.logout);

router.patch("/", authMiddlewares, ctrl.updateSubscription);

module.exports = router;