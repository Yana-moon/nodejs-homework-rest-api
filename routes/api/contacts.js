const express = require("express");

const controllers = require("../../controllers/contacts");

const {isValidId, authMiddlewares } = require("../../middlewares");

const router = express.Router();

router.get("/",authMiddlewares, controllers.getAllContacts);

router.get("/:contactId", authMiddlewares, isValidId, controllers.getById);

router.post("/", authMiddlewares, controllers.addNewContact);

router.delete("/:contactId", authMiddlewares, isValidId, controllers.deleteById);

router.put("/:contactId", authMiddlewares, isValidId, controllers.updateById);

router.patch("/:contactId/favorite", authMiddlewares, isValidId, controllers.updateFavorite);

module.exports = router;
