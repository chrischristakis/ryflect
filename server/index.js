const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const router = require('./routes/router.js');
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Route all requests to /api/...
app.use(express.json());
app.use('/api', router);

// Establish mongo connection
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB!");
}).catch((err) => {
    console.log("Cannot connect to MongoDB: ", err);
});

// Setup express server to listen on port
app.listen(PORT, async () => {
    console.log("Running on port =", PORT);
});