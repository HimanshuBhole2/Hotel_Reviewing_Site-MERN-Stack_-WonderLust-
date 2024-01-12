const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(), 
        country: Joi.string().required(),
        category: Joi.string().valid("Trending","Farm","Rooms","Castel","Iconic City","Mountain View","Beach","Cabins","Camping","Glofing","Island").required(),
    }).required()
})

module.exports.reviewSchema= Joi.object({
    review : Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})