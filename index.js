const express = require('express');
const dotenv = require('dotenv');
const connectedToDb = require('./database/db');
const cors = require('cors');
const cloudinary = require('cloudinary');

const app = express();
dotenv.config();

cloudinary.config({ 
    cloud_name: 'dtaugiocz', 
    api_key: '268562646484397', 
    api_secret: 'qy_JzggPbgznzb5NLv_lozvyHQ0' 
});

const corsOptions = {
    origin: true,
    credentials: true,
    optionaSuccessStatus: 200,
};
app.use(cors(corsOptions));

connectedToDb();

// Use express.json() for parsing JSON data
app.use(express.json());

app.use('/api/user', require('./routes/userRoute'));
app.use('/api/product', require('./routes/productRoutes'));

app.get('/hello', (req, res) => {
    res.status(200).json("Hello World!");
});

app.get("/test", (req, res) => {
    res.send("hello from server");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
});
