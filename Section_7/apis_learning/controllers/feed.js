const { handleValidationErrors } = require("../middlewares/validation");

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
    console.error(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const validationPassed = await handleValidationErrors(req, res, next);

    if (!validationPassed) return;

    const { title, content } = req.body;

    res.status(201).json({
      message: "Post created successfully!",
      post: {
        _id: Date.now(),
        title,
        content,
        creator: { name: "Howard" },
        createdAt: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
  }
};
