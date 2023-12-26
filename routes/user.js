const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const user = require("../models/user.js");
const passport = require("passport");

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
    res.redirect("/listings");
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",passport.authenticate("local",{failureRedirect:"/login"}),(req,res)=>{
    res.redirect("/listings");
})



module.exports = router;