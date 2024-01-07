const bcrypt = require("bcrypt");

const User = require("../models/user");

const rootValue = {
  createUser: async (args, req) => {
    try {
      const { email, password, name } = args.userInput;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error(
          "Email entered already in use, please enter a different email"
        );
        throw error;
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      if (!hashedPassword) {
        const error = new Error("Failed to register user");
        throw error;
      }

      const newUser = new User({ name, email, password: hashedPassword });
      const newUserCreated = await newUser.save();
      if (!newUserCreated) {
        const error = new Error("Failed to register user");
        throw error;
      }

      return {
        ...newUserCreated._doc,
        _id: newUserCreated._id.toString(),
        createdAt: newUserCreated.createdAt.toISOString(),
        updatedAt: newUserCreated.updatedAt.toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = rootValue;
