const passport = require("passport");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You Must be logged in for accessing");
        return res.redirect("/login");
    }
    next();
}