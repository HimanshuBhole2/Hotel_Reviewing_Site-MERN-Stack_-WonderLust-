// All Requirements 
const express = require("express");
const mongoose = require("mongoose");
const ListingModel = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const {listingSchema,reviewSchema} = require('./schema.js');
const ReviewModel = require("./models/review.js");

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

main().then(()=>{
    console.log("This connection done successfully");
}).catch((err)=>{
    console.log(err);
})


// async function for error handling

const validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


app.get("/listing",wrapAsync(async (req,res)=>{
    const allListning = await ListingModel.find({});
    res.render("listings/index.ejs", {allListning});
    
}))


// create page
app.get("/listing/new",wrapAsync(async(req,res,next)=>{
    res.render("listings/new.ejs")
   
}))

app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id).populate('reviews');
    
    res.render('listings/show.ejs',{listing});
}));

// edit request

app.get("/listing/:id/edit",wrapAsync( async (req, res) => {
    let { id } = req.params;
    // Fetch the listing based on the ID and render the edit page
    let listing = await ListingModel.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

app.put("/listing/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
}));

// delete Route
app.delete("/listing/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await ListingModel.findByIdAndDelete(id);
    console.log(list);
    res.redirect("/listing");
}))

app.delete("/listing/:id/review/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}))

// adding new list post method

app.post("/listing",validateListing,wrapAsync( async (req, res, next) => {
        let listing = new ListingModel(req.body.listing);
        await listing.save();
        res.redirect("/listing");
}))

app.post("/listing/:id/review",validateReview,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing1 = await ListingModel.findById(id);
    let review1 = new ReviewModel(req.body.review);
    await listing1.reviews.push(review1);
    await listing1.save();
    await review1.save();
    console.log("Successfully Done with saving");
    res.redirect(`/listing/${id}`);
}))

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