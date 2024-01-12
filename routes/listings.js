const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ListingModel = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    // All Listings
    .get(wrapAsync( ListingController.index))
    // adding new listing
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync( ListingController.addNewListings));


// create page
router.get("/new",isLoggedIn,wrapAsync(ListingController.renderNewForm));



// Update Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editNewListings));


// Filter
router.get("/category",async (req,res)=>{
    let category =await req.query.category;
    console.log(category);
    let FilterdListings = await ListingModel.find({ category: category });
    res.render("listings/index.ejs",{allListning: FilterdListings});
})




router.route("/:id")
// Show Route
    .get(wrapAsync(ListingController.showListings))
// Update Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.updateListings))
// delete ROute 
    .delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListings));





module.exports = router;