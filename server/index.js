const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const router = require('./routes/router.js');
const { PORT, MONGO_URL } = require('./utils/config.js');

// Route all requests to /api/...
app.use(cors());
app.use(express.json());
app.use('/api', router);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Establish mongo connection
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB!");
}).catch((err) => {
    console.log("Cannot connect to MongoDB: ", err);
});

// All get requests not handled by our other routes serve the front end
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Setup express server to listen on port
app.listen(PORT, async () => {
    console.log("Running on port =", PORT);
});