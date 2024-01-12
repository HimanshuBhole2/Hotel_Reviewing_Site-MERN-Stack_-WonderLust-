const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const review =  require("./review.js");

const ListingSchema = new mongoose.Schema({
    title:String,
    description:String,
    image: {
       url:String,
       fileName:String,
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
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category:{
        type:String,
        enum:["Trending","Farm","Rooms","Castel","Iconic City","Mountain View","Beach","Cabins","Camping","Glofing","Island"]
    }
});


ListingSchema.post("findOneAndDelete",async (listing)=>{
if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});
}
})

const ListingModel = mongoose.model("Listing", ListingSchema);
module.exports = ListingModel;