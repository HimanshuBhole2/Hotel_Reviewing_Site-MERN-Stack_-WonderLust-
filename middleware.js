const ListingModel = require("./models/listing.js");
const reviewModel = require("./models/review.js");
const ExpressError = require("./utils/ExpressErrors.js");
const{listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You Must be logged in for accessing");
        return res.redirect("/login");
    }
    next();
}

module.exports.isRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner =async (req,res,next) =>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error',"You are not authorised");
        res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await reviewModel.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error',"You are not authorised");
        res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


