// All Requirements 
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


// All Constants 
const monurl = 'mongodb://127.0.0.1:27017/wanderlust'
const app = express();
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

async function main(){
    await mongoose.connect(monurl);
}


const sessionOptions =  {
    secret:"mysecreatesession",
    resave:false,
    saveUninitialized:true
};


main().then(()=>{
    console.log("This connection done successfully");
}).catch((err)=>{
    console.log(err);
})


app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// app.get("/ListingModel",async (req,res)=>{
//     let sampleListning = new ListingModel({
//         title:"My New Villa",
//         description:"By the beatch",
//         price:1500,
//         location:"Pushpendra Nagar",
//     })

//     await sampleListning.save();
//     console.log("Sample Was Saved ");
//     res.send("<h1>Saved Data Successfully</h1>");
// })

app.get("/",(req,res)=>{
    res.send("<h1>This is our Home Page </h1>")
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