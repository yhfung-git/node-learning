const { handleValidationErrors } = require("../middlewares/validation");
const { errorHandler } = require("../utils/errorHandler");
const { clearImage } = require("../utils/clearImage");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    if (!posts.length) {
      const error = errorHandler(404, "Posts not found");
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
      const error = errorHandler(404, "Post not found");
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

    const imageUrl = `images/${req.file.filename}`;
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl,
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

exports.updatePost = async (req, res, next) => {
  try {
    const validationPassed = await handleValidationErrors(req, res, next);

    if (!validationPassed) return;

    const { postId } = req.params;
    const { title, content } = req.body;
    const imageUrl =
      req.file && req.file.mimetype.startsWith("image")
        ? `images/${req.file.filename}`
        : req.body.image;

    if (!imageUrl) {
      const error = errorHandler(
        422,
        "No image provided or uploaded file is not an image"
      );
      throw error;
    }

    const post = await Post.findById(postId);
    if (!post) {
      const error = errorHandler(404, "Post not found");
      throw error;
    }

    if (imageUrl !== post.imageUrl) await clearImage(post.imageUrl);

    post.set({ title, content, imageUrl });

    const updatedPost = await post.save();

    if (!updatedPost) {
      const error = errorHandler(500, "Failed to update the post");
      throw error;
    }

    res.status(200).json({
      message: "Post updated successfully!",
      post: updatedPost,
    });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      const error = errorHandler(404, "Post not found");
      throw error;
    }

    await clearImage(post.imageUrl);

    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      const error = errorHandler(500, "Failed to delete the post");
      throw error;
    }

    res.status(200).json({
      message: "Post deleted successfully!",
    });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
