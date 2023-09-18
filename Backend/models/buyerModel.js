const mongoose  = require('mongoose');

const buyerSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true, 
        trim:true,
    },
    email:{
        type:String,
        required: true, 
    },
    password:{
        type:String,
        required: true, 
        
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:{},
        required:true,
    },
    answer:{
        type: String,
        required:true,
    },
    role:{
        type:Number,
        default:0
    }

}, {timestamps:true})
module.exports = mongoose.model("buyers", buyerSchema);