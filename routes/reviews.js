const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {listingSchema,reviewSchema} = require('../schema.js');
const ListingModel = require("../models/listing.js")
const ReviewModel = require("../models/review.js");
const review = require("../models/review.js");

const validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


// Delete the review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

// add the review
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing1 = await ListingModel.findById(id);
    let review1 = new ReviewModel(req.body.review);
    await listing1.reviews.push(review1);
    await listing1.save();
    await review1.save();
    console.log("Successfully Done with saving");
    res.redirect(`/listings/${id}`);
}))


module.exports = router;