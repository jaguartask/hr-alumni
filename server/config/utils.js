
exports.checkUser = function(req, res, next) {
  console.log("checkUser is called");
  if  (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

exports.test = function(){
  console.log("test function ran");
}