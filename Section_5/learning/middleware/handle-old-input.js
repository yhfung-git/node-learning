module.exports = (req, res, next) => {
  try {
    res.locals.oldInput = req.body;

    next();
  } catch (err) {
    console.error("Error in handling old input middleware:", err);
    next(err);
  }
};
