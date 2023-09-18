const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    
    slug:{
        type: String,
        lowercase: true,
    },
});
module.exports = mongoose.model("category", categorySchema);