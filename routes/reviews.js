const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {listingSchema,reviewSchema} = require('../schema.js');
const ListingModel = require("../models/listing.js")
const ReviewModel = require("../models/review.js");
const review = require("../models/review.js");
const flash = require("connect-flash");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")


// Delete the review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(async(req,res,next)=>{
    let {id,reviewId} = req.params;
    await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}))

// add the review
router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing1 = await ListingModel.findById(id);
    let review1 = new ReviewModel(req.body.review);
    review1.author = req.user._id;
    console.log(review1)
    await listing1.reviews.push(review1);
    await listing1.save();
    await review1.save();
    req.flash("success","New Review Added Successfully");

    res.redirect(`/listings/${id}`);
}))


module.exports = router;