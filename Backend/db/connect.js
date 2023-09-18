const mongoose  = require('mongoose');

const connectDb = async (uri) =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to mongodb databse ${conn.connection.host}`);
    } catch (error) {
        console.log(`error in Mongodb ${error}`)
    }
       
    
 };
 module.exports = connectDb;

// mongodb://localhost:27017/admin