const { Contact, schemas } = require("../models/contact");

const { AppError, controllersWrapper } = require("../utils");

const getAllContacts = async (_req, res, _next) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");
  res.status(200).json(result);
};

const getById = async (req, res, _next) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw AppError(404, "Not found");
  }

  res.status(200).json(result);
};

const addNewContact = async (req, res, _next) => {
  const { error } = schemas.addSchema.validate(req.body);
  if (error) {
    throw AppError(400, error.message);
  }
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteById = async (req, res, _next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);

  if (!result) {
    throw AppError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateById = async (req, res, _next) => {
  const { error } = schemas.addSchema.validate(req.body);
  if (error) {
    throw AppError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate({ _id: contactId }, req.body, {
    new: true,
  });

  if (!result) {
    throw AppError(404, "Not found");
  }
  res.status(200).json(result);
};

const updateFavorite = async (req, res, _next) => {
  const { error } = schemas.updateFavoriteSchema.validate(req.body);
  if (error) {
    throw AppError(400, "missing fields favorite");
  }
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate({ _id: contactId }, req.body, {
    new: true,
  });

  if (!result) {
    throw AppError(404, "Not found");
  }
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: controllersWrapper(getAllContacts),
  getById: controllersWrapper(getById),
  addNewContact: controllersWrapper(addNewContact),
  deleteById: controllersWrapper(deleteById),
  updateById: controllersWrapper(updateById),
  updateFavorite: controllersWrapper(updateFavorite),
};