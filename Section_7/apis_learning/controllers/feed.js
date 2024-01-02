const { handleValidationErrors } = require("../middlewares/validation");
const { errorHandler } = require("../utils/errorHandler");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    res.status(200).json({
      posts: [
        {
          _id: Date.now(),
          title: "First Post",
          content: "This is the FIRST post!",
          imageUrl: "images/cards.jpg",
          creator: {
            name: "Howard",
          },
          createdAt: new Date(),
        },
      ],
    });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const validationPassed = await handleValidationErrors(req, res, next);

    if (!validationPassed) return;

    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl: "images/cards.jpg",
      creator: { name: "Howard" },
    });

    const postSaved = await post.save();
    if (!postSaved) {
      const error = errorHandler(500, "Failed to save the post");
      throw error;
    }

    res.status(201).json({
      message: "Post created successfully!",
      post: postSaved,
    });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
