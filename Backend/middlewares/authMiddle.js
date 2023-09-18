const JWT = require('jsonwebtoken');
const buyerModel = require('../models/buyerModel');

//protected routes takes here
const requireSignIn = async (req, res, next) =>{
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
        
    } catch (error) {
        console.log(error);
        
    }
};

//admin access
const isAdmin = async (req, res, next) =>{
    try {
        const user = await buyerModel.findById(req.user._id)
        if(user.role!==1){
            return res.status(401).send({
                success:false,
                message:"UnAuthorized Access"
            })
        } else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {requireSignIn, isAdmin}