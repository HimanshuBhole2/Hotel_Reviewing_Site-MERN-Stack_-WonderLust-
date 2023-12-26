const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {listingSchema,reviewSchema} = require('../schema.js');
const ListingModel = require("../models/listing.js")


const validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


// all listings 
router.get("/",wrapAsync(async (req,res)=>{
    const allListning = await ListingModel.find({});
    res.render("listings/index.ejs", {allListning});
    
}))


// create page
router.get("/new",wrapAsync(async(req,res,next)=>{
    res.render("listings/new.ejs")
   
}))

// Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id).populate('reviews');
    
    res.render('listings/show.ejs',{listing});
}));



// edit request
router.get("/:id/edit",wrapAsync( async (req, res) => {
    let { id } = req.params;
    // Fetch the listing based on the ID and render the edit page
    let listing = await ListingModel.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

// Update Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

// delete Route
router.delete("/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await ListingModel.findByIdAndDelete(id);
    console.log(list);
    res.redirect("/listings");
}))

// adding new list post method
router.post("/",validateListing,wrapAsync( async (req, res, next) => {
    let listing = new ListingModel(req.body.listing);
    await listing.save();
    res.redirect("/listings");
}))

module.exports = router;