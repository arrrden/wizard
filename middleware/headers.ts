module.exports = (req, res, next) => {
  res.header("X-Hello", "WIZRD");
  next();
};
