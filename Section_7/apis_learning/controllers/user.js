const { handleValidationErrors } = require("../middlewares/validation");
const { errorHandler } = require("../utils/errorHandler");
const User = require("../models/user");

exports.status = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) throw errorHandler(404, "User not found");

    if (user._id.toString() !== req.userId)
      throw errorHandler(403, "Not authorized to see this status");

    res.status(200).json({ status: user.status });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const validationPassed = await handleValidationErrors(req, res, next);

    if (!validationPassed) return;

    const { userId } = req.params;
    const newStatus = req.body.status;

    const user = await User.findById(userId);
    if (!user) throw errorHandler(404, "User not found");

    if (user._id.toString() !== req.userId)
      throw errorHandler(403, "Not authorized to update this status");

    user.status = newStatus;
    const updatedStatus = await user.save();
    if (!updatedStatus)
      throw errorHandler(500, "Failed to update user's status");

    res
      .status(200)
      .json({ message: "Status updated successfully!", status: updatedStatus });
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
