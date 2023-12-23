const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/posts.js");
const cookieParser = require("cookie-parser")

app.use(cookieParser("Secreate Code"));

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