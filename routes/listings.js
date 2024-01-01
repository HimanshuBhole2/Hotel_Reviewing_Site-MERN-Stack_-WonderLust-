const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ListingModel = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controller/listings.js");


// all listings 
router.get("/",wrapAsync( ListingController.index))


// create page
router.get("/new",isLoggedIn,wrapAsync(ListingController.renderNewForm));

// Show Route
router.get("/:id",wrapAsync(ListingController.showListings));

// Update Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editNewListings));


router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.updateListings));

// delete Route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(ListingController.destroyListings))

// adding new list post method
router.post("/", isLoggedIn,validateListing,wrapAsync( ListingController.addNewListings))

module.exports = router;