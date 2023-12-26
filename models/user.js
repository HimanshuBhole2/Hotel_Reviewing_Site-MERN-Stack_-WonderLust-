const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pasportlocalmongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(pasportlocalmongoose);

module.exports = mongoose.model("User",userSchema);