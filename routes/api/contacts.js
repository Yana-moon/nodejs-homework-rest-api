const express = require("express");

const controllers = require("../../controllers/contacts");

const isValidId = require("../../middlewares");

const router = express.Router();

router.get("/", controllers.getAllContacts);

router.get("/:contactId", isValidId, controllers.getById);

router.post("/", controllers.addNewContact);

router.delete("/:contactId", isValidId, controllers.deleteById);

router.put("/:contactId", isValidId, controllers.updateById);

router.put("/:contactId/favorite", isValidId, controllers.updateFavorite);

module.exports = router;
