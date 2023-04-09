const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const router = require('./routes/router.js');
const PORT = process.env.PORT;

app.use('/api', router);

app.listen(PORT, () => {
    console.log("Running on port =", PORT);
});