const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_PRIVATE_KEY } = process.env;

const {
  validateSignupInput,
  validateCreatePostInput,
} = require("../helpers/validateInput");
const { throwError } = require("../helpers/throwError");

const User = require("../models/user");
const Post = require("../models/post");

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
  createPost: async (args, { req }) => {
    try {
      if (!req.isAuth) throwError(401, "Not authenticated!");

      const { title, imageUrl, content } = args.postInput;

      const errors = validateCreatePostInput(title, imageUrl, content);
      if (errors.length > 0) throwError(422, "Invalid input", errors);

      const user = await User.findById(req.userId);
      if (!user) throwError(401, "Unauthorized access.");

      const newPost = new Post({
        title,
        imageUrl,
        content,
        creator: user,
      });

      const newPostCreated = await newPost.save();
      if (!newPostCreated) throwError(500, "Failed to save new post");

      user.posts.push(newPostCreated);
      const savedUserPost = await user.save();
      if (!savedUserPost)
        throwError(500, "Failed to save new post to user's posts");

      return {
        ...newPostCreated._doc,
        _id: newPostCreated._id.toString(),
        createdAt: newPostCreated.createdAt.toISOString(),
        updatedAt: newPostCreated.updatedAt.toISOString(),
      };
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  },
};

module.exports = rootValue;
