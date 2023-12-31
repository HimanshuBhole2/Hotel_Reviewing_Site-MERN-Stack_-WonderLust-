const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {listingSchema,reviewSchema} = require('../schema.js');
const ListingModel = require("../models/listing.js");
const flash = require("connect-flash");
const passport = require("passport");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");



// all listings 
router.get("/",wrapAsync(async (req,res)=>{
    const allListning = await ListingModel.find({});
    res.render("listings/index.ejs", {allListning});
    
}))


// create page
router.get("/new",isLoggedIn,wrapAsync(async(req,res,next)=>{
    res.render("listings/new.ejs")
   
}))

// Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id)
    .populate({path:"reviews",
    populate:{
        path:"author"
    }
    }).populate('owner');
    if(!listing){
        req.flash("error","Listing You Requested Does Not Existed");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs',{listing});
}));



// Update Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( async (req, res) => {
    let { id } = req.params;
    // Fetch the listing based on the ID and render the edit page
    let listing = await ListingModel.findById(id);
    if(!listing){
        req.flash("error","Listing You Requested Does Not Existed");
        return res.redirect("/listings");
    }
    res.render('listings/edit.ejs', { listing });
}));


router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let{id} = req.params
    await ListingModel.findByIdAndUpdate(id,{...req.body.listing});
    req.flash('success',"Listing Updated Successfully");
    res.redirect("/listings");
}));

// delete Route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await ListingModel.findByIdAndDelete(id);
    if(!listing){
        req.flash("error","Listing You Requested Does Not Existed");
        return res.redirect("/listings");
    }
    req.flash('success',`${listing.title} deleted Successfully`);
    res.redirect("/listings");
}))

// adding new list post method
router.post("/", isLoggedIn,validateListing,wrapAsync( async (req, res, next) => {
    let listing = new ListingModel(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash('success',"New Listing Created");
    res.redirect("/listings");
}))

module.exports = router;