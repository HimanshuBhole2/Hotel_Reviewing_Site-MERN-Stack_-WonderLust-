const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const user = require("../models/user.js");
const passport = require("passport");
const session = require("express-session");
const {isRedirectUrl} = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup")
})

router.post("/signup",wrapAsync(async(req,res)=>{
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
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post(
    "/login",
    isRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:"/login"})
    ,async (req,res)=>{
        let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
})
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);}
        req.flash("success","Logged Out Successfully.");
        res.redirect("/listings")
    })

})



module.exports = router;