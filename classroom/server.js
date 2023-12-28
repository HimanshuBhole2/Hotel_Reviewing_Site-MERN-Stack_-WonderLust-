const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/posts.js");
const cookieParser = require("cookie-parser")
const session = require("express-session");
const flash = require('connect-flash');
const path = require('path');


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions =  {
    secret:"mysupersecreatecode",
    resave:false,
    saveUninitialized:true
};
app.use(cookieParser("Secreate Code"));
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg= req.flash("name");
    res.locals.errorMsg = req.flash("error");
    next();
})


app.get("/register",(req,res)=>{
    let {name= "anonymus"} = req.query;
    req.session.name = name;
    if(name=="anonymus"){
         req.flash("error","User is not registered"); 
    }else{
        req.flash("name","Logged in Successfully");
    }
    res.redirect("/hello");

})

app.get("/hello",(req,res)=>{
    let name = req.session.name;
    res.render("new.ejs",{name});
})


// app.get("/countsession",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
   
//     res.send(`You Visited Here by ${req.session.count}`);
// })

app.get("/getsignedcookie",(req,res)=>{
    res.cookie("Country","India",{signed:true});
    res.send("hello");
})

app.get("/verify",(req,res)=>{
    let{Country} = req.signedCookies;
    console.log(req.signedCookies);
    res.send("verified")
})


app.get("/sendcookie",(req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("Hello","World");
    res.send("Cookie is Sended Over the server");
})

app.use('/user',user);
app.use('/post',post);

app.get("/hello",(req,res)=>{
    let {name} = req.cookies;
    res.send(`hello ${name}`);
})

app.get('/',(req,res)=>{
    console.log(req.cookies);
    res.send("This is Home route");
})




app.listen(3000,(req,res)=>{
    console.log("server is started");
})