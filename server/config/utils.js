
exports.checkUser = function(req, res, next) {
  console.log("checkUser is called");
  if  (!req.isAuthenticated()) { 
    console.log("user not authenticated");
    res.redirect('/login');
  } else {
    console.log("user authenticated");
    next();
  }
};

exports.test = function(){
  console.log("test function ran");
}