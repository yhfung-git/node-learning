module.exports = (req, res, next) => {
  try {
    res.locals.oldInput = req.body;

    next();
  } catch (err) {
    next(new Error(err));
  }
};
