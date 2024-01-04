const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_PRIVATE_KEY } = process.env;

const { handleValidationErrors } = require("../middlewares/validation");
const { errorHandler } = require("../utils/errorHandler");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const validationPassed = await handleValidationErrors(req, res, next);

    if (!validationPassed) return;

    const { name, email, password } = req.body;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!hashedPassword) {
      const error = errorHandler(500, "Failed to register user");
      throw error;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const newUserSaved = await newUser.save();
    if (!newUserSaved) {
      const error = errorHandler(500, "Failed to register user");
      throw error;
    }

    res.status(201).json({
      message: "Congratulations! You've successfully signed up!",
      userId: newUserSaved._id,
    });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = errorHandler(401, "Invalid email or password");
      throw error;
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      const error = errorHandler(401, "Invalid email or password");
      throw error;
    }

    const userId = user._id.toString();
    const token = jwt.sign({ email: user.email, userId }, JWT_PRIVATE_KEY, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    res.status(200).json({ token, userId });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
