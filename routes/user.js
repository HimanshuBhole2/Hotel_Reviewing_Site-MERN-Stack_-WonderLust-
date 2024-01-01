const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const user = require("../models/user.js");
const passport = require("passport");
const session = require("express-session");
const {isRedirectUrl} = require("../middleware.js");
const UserController = require("../controller/users.js")


router.get("/signup",UserController.renderSignUpForm);

router.post("/signup",wrapAsync(UserController.signup))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})


router.post(
    "/login",
    isRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:"/login"})
    ,UserController.logIn)
router.get("/logout",UserController.logOut)



module.exports = router;