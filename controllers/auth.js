const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { User, schemas } = require("../models/user");

const { AppError, controllersWrapper } = require("../utils");

dotenv.config();
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { error } = schemas.registerSchema.validate(req.body);
  if (error) {
    throw AppError(400, error.message);
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw AppError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { error } = schemas.loginSchema.validate(req.body);
  if (error) {
    throw AppError(400, error.message);
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw AppError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw AppError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    email: user.email,
    subscription: user.subscription,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "No Content",
  });
};

const updateSubscription = async (req, res) => {
  const { error } = schemas.updateSubscriptionSchema.validate(req.body);
  if (error) {
    throw AppError(400, "missing field subscription or set incorrectly");
  }
  const { _id, email } = req.user;
  const { subscription } = req.body;

  const result = await User.findOneAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  if (!result) {
    throw AppError(404, "Not found");
  }
  res.status(200).json({ email, subscription });
};

module.exports = {
  register: controllersWrapper(register),
  login: controllersWrapper(login),
  getCurrent: controllersWrapper(getCurrent),
  logout: controllersWrapper(logout),
  updateSubscription: controllersWrapper(updateSubscription),
};