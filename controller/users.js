const User = require("../models/user");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup")
};

module.exports.signup = async(req,res)=>{
    let {username,email,password} = req.body;
    let user1 = new User({
        email:email,
        username:username
    })
    let registereduser = await User.register(user1,password);
    req.logIn(registereduser,(err)=>{
        if(err){
            return next(err);}
            req.flash("success","Welcome to WonderLust. ");
           return  res.redirect("/listings")
    })
};

module.exports.logIn = async (req,res)=>{
    req.flash("success","LogIn Successfully.");
    let redirectUrl = res.locals.redirectUrl || "/listings"
res.redirect(redirectUrl);
}

module.exports.logOut = (req,res)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);}
        req.flash("success","Logged Out Successfully.");
        res.redirect("/login")
    })

}