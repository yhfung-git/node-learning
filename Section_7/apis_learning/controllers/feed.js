const { getIO } = require("../socket");
const { handleValidationErrors } = require("../middlewares/validation");
const { errorHandler } = require("../utils/errorHandler");
const { clearImage } = require("../utils/clearImage");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const itemPerPage = 3;
    const totalItems = await Post.countDocuments();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * itemPerPage)
      .limit(itemPerPage)
      .populate("creator");

    res.status(200).json({ posts, totalItems });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("creator");
    if (!post) throw errorHandler(404, "Post not found");

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
      creator: req.userId,
    });

    const postSaved = await post.save();
    if (!postSaved) throw errorHandler(500, "Failed to save the post");

    const user = await User.findById(req.userId);
    if (!user) throw errorHandler(404, "User not found");

    user.posts.push(post);
    const userSaved = await user.save();
    if (!userSaved)
      throw errorHandler(500, "Failed to save new post to user's posts");

    getIO().emit("posts", {
      action: "create",
      post: {
        ...postSaved._doc,
        creator: { _id: req.userId, name: user.name, key: user._id },
      },
    });

    res.status(201).json({
      message: "Post created successfully!",
      post: postSaved,
      creator: { _id: user._id, name: user.name },
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

    if (!imageUrl)
      throw errorHandler(
        422,
        "No image provided or uploaded file is not an image"
      );

    const post = await Post.findById(postId);
    if (!post) throw errorHandler(404, "Post not found");

    if (post.creator.toString() !== req.userId)
      throw errorHandler(403, "Not authorized to update this post");

    if (imageUrl !== post.imageUrl) {
      const clearedImage = await clearImage(post.imageUrl);
      if (!clearedImage) throw errorHandler(500, "Failed to clear image");
    }

    post.set({ title, content, imageUrl });
    const updatedPost = await post.save();
    if (!updatedPost) throw errorHandler(500, "Failed to update the post");

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
    if (!post) throw errorHandler(404, "Post not found");

    if (post.creator.toString() !== req.userId)
      throw errorHandler(403, "Not authorized to delete this post");

    const clearedImage = await clearImage(post.imageUrl);
    if (!clearedImage) throw errorHandler(500, "Failed to clear image");

    const updated = await User.updateMany(
      { posts: postId },
      { $pull: { posts: postId } }
    );
    if (updated.modifiedCount === 0)
      throw errorHandler(500, "Failed to delete post from users' posts");

    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) throw errorHandler(500, "Failed to delete the post");

    res.status(200).json({
      message: "Post deleted successfully!",
    });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
