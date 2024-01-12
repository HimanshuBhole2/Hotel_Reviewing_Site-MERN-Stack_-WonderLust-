const ListingModel = require("../models/listing.js")
const MAP_API_KEY = process.env.MAP_API_KEY;
const axios = require('axios');

module.exports.index = async (req,res)=>{
    const allListning = await ListingModel.find({});
    res.render("listings/index.ejs", {allListning});
    
}

module.exports.getFilteredListings = async (req,res)=>{
    let category =await req.query.category;
    let FilterdListings = await ListingModel.find({ category: category });
    res.render("listings/index.ejs",{allListning: FilterdListings});
}

module.exports.renderNewForm = async(req,res,next)=>{
    res.render("listings/new.ejs")
   
}

module.exports.showListings = async(req,res)=>{
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
}

module.exports.editNewListings = async (req, res) => {
    let { id } = req.params;
    // Fetch the listing based on the ID and render the edit page
    let listing = await ListingModel.findById(id);
    if(!listing){
        req.flash("error","Listing You Requested Does Not Existed");
        return res.redirect("/listings");
    }
    let OriginalImage = listing.image.url;
    OriginalImage.replace("/upload","/upload/w_250")
    res.render('listings/edit.ejs', { listing,OriginalImage });
}

module.exports.updateListings = async(req,res)=>{
    let{id} = req.params
    let listing = await ListingModel.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof(req.file)!=="undefined"){
    let url = req.file.path;
    let fileName = req.file.filename;
    listing.image = {url,fileName};
    listing.save()
   }
    req.flash('success',"Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req, res) => {
    let { id } = req.params;
    let listing = await ListingModel.findByIdAndDelete(id);
    if(!listing){
        req.flash("error","Listing You Requested Does Not Existed");
        return res.redirect("/listings");
    }
    req.flash('success',`${listing.title} deleted Successfully`);
    res.redirect("/listings");
}

module.exports.addNewListings = async (req, res, next) => {
    let url = req.file.path;
    let fileName = req.file.filename;
    let listing = new ListingModel(req.body.listing);

    console.log(listing.category);

    
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: listing.location,
            key: MAP_API_KEY,
        },
    });
    const {lat,lng} = response.data.results[0].geometry.location;

    listing.owner = req.user._id;
    listing.image = {url,fileName};
    listing.geometry = {type:"Point",coordinates:[lng,lat]}
    await listing.save();
    req.flash('success',"New Listing Created");
    res.redirect("/listings");
}