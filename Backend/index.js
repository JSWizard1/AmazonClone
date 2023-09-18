const express = require('express');
//configure env
require('dotenv').config();
const morgan = require('morgan');
const connectDb = require('./db/connect')
const authRoute = require('./routes/authRoute')
const cors = require('cors')
const categoryRoutes  =require('./routes/categoryRoute')
const productRoutes = require('./routes/prodoutRoute')
// const path = require("path")
 
// rest object
const app = express();

// database config
connectDb();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
// app.use(express.static(path.join(__dirname, "./frontend/build")))

//routes
app.use('/api/vl/auth', authRoute);
app.use('/api/vl/category', categoryRoutes);
app.use('/api/vl/product', productRoutes);

// rest api
// app.use('*', function(req, res){
//     res.sendFile(path.join(__dirname, "./imazone-clone/build/index.html"))
// })
// app.get("/", (req, res) =>{
//     res.send("hello coders")
// })

const PORT = process.env.PORT

app.listen(PORT)




