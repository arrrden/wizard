module.exports = (req, res, next) => {
    console.log(req)
    if (req.body.name && req.body.name.length > 63) res.status(400).send("Your name is too long")
    next();
  };
  