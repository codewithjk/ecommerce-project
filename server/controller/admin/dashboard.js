exports.getDashboard = (req, res) => {
  console.log(req.cookies);
  res.render("dashboard");
};
