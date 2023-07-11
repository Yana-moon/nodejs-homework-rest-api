const jwt = require("jsonwebtoken");

const { AppError } = require("../utils");

const { User } = require("../models/user");


const { JWT_SECRET } = process.env;

const authMiddlewares = async (req, _res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(AppError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(AppError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(AppError(401, "Not authorized"));
  }
};

module.exports = authMiddlewares;