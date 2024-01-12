if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}
// All Requirements 
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const isLoggedIn = require("./middleware.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const flash = require("connect-flash");

const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


// All Constants 
// const monurl = 'mongodb://127.0.0.1:27017/wanderlust'
const dbUrl = process.env.ATLAS_URL;
const app = express();
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

store.on("error",()=>{
    console.log("Error Occoured in stored ",err);
})

const sessionOptions =  {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};


main().then(()=>{
    console.log("This connection done successfully");
}).catch((err)=>{
    console.log(err);
})


app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
})


app.get("/demouser",async(req,res)=>{
    let FakeUser = new User({
        email:"bhole@gmail.com",
        username:"delta-student"
    })

    let registereduser = await User.register(FakeUser,"helloworld");
    res.send(registereduser);
})


// async function for error handling
app.use('/listings',listingRouter);
app.use('/listings/:id/review',reviewsRouter)
app.use('/',userRouter);


app.get("/",(req,res)=>{
    res.redirect("/listings");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
})

app.use((err,req,res,next)=>{
    let {status=500, message="Not found"} = err;
    res.status(status).render("listings/error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server start Working");
})