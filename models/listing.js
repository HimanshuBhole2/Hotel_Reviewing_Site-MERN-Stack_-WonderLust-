const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const review =  require("./review.js");


const ListingSchema = new mongoose.Schema({
    title:String,
    description:String,
    image: {
        type:String,

        default:"https://images.unsplash.com/photo-1702035120682-d9132123f838?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

        set:(url)=>url===""?"https://images.unsplash.com/photo-1702035120682-d9132123f838?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":url,
    },
    price: Number,
    location: String, 
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});


ListingSchema.post("findOneAndDelete",async (listing)=>{
if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});
}
})

const ListingModel = mongoose.model("Listing", ListingSchema);
module.exports = ListingModel;