// importing Packages
const express = require('express');
const dotenv=require('dotenv');
const connectToDB = require('./database/db');
const cors = require('cors');
const cloudinary = require('cloudinary');
const acceptMultimedia = require('connect-multiparty');

// creating an express app
const app = express();

// importing the routes or defining the routes

// configuring dotenv to use the .env file
dotenv.config();

// cloudinary config          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

app.use(acceptMultimedia());
// Cors config to accept request from frontend
const corsOptions={
    origin:true,
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
// connecting to database
connectToDB();
// accepting json data
app.use(express.json());
//defining routes
app.use('/api/user',require('./routes/userRoute'));
app.use('/api/product',require('./routes/productRoutes'));

// creating test route
app.get("/test",(req,res)=>{
    res.status(200).json({message:"Hello World test api is working"});
})

//task to create hello route
app.get('/hello', (req, res) => {
    //res.send('Hello World2!');
    res.status(200).send({
        message: 'Hello World!'
    });
});
// Defining port
const PORT = process.env.PORT;
//running the server on port 5000
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
});

module.exports = app;