const { handleValidationErrors } = require("../middlewares/validation");
const { errorHandler } = require("../utils/errorHandler");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    if (!posts.length) {
      const error = errorHandler(404, "No posts found");
      throw error;
    }

    res.status(200).json({ posts });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      const error = errorHandler(404, "No post found");
      throw error;
    }

    res.status(200).json({ post });
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
