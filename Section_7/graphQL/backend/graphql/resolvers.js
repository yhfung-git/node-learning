const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_PRIVATE_KEY } = process.env;

const User = require("../models/user");
const { throwError } = require("../helpers/throwError");
const { validateSignupInput } = require("../helpers/validateInput");

const rootValue = {
  createUser: async (args, req) => {
    try {
      const { email, password, name } = args.userInput;

      const errors = validateSignupInput(email, password, name);
      if (errors.length > 0) throwError(422, "Invalid input", errors);

      const existingUser = await User.findOne({ email });
      if (existingUser) throwError(422, "Email already in use");

      const existingName = await User.findOne({ name });
      if (existingName) throwError(422, "Name already in use");

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      if (!hashedPassword) throwError(500, "Failed to register user");

      const newUser = new User({ name, email, password: hashedPassword });
      const newUserCreated = await newUser.save();
      if (!newUserCreated) throwError(500, "Failed to register user");

      return {
        ...newUserCreated._doc,
        _id: newUserCreated._id.toString(),
        createdAt: newUserCreated.createdAt.toISOString(),
        updatedAt: newUserCreated.updatedAt.toISOString(),
      };
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throwError(401, "Invalid email or password");

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) throwError(401, "Invalid email or password");

      const userId = user._id.toString();
      const token = jwt.sign({ email: user.email, userId }, JWT_PRIVATE_KEY, {
        expiresIn: "1h",
        algorithm: "HS256",
      });

      return { token, userId };
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  },
};

module.exports = rootValue;
