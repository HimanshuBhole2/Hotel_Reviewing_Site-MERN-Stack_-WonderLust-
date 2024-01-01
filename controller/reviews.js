const { model } = require("mongoose");
const ReviewModel = require("../models/listing");
const ListingModel = require("../models/listing");


module.exports.destroyReview = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.createReview = async (req,res,next)=>{
    let {id} = req.params;
    let listing1 = await ListingModel.findById(id);
    let review1 = new ReviewModel(req.body.review);
    review1.author = req.user._id;
    
    await listing1.reviews.push(review1);
    await review1.save();
    await listing1.save();
    req.flash("success","New Review Added Successfully");

    res.redirect(`/listings/${id}`);
};
