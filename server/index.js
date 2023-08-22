const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const router = require('./routes/router.js');
const { PORT, MONGO_URL, ENV } = require('./utils/config.js');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const cron = require('./cron');
const JSONValidator = require('./middleware/JSONValidator.js');

app.use(cors({
    credentials: true,  // We need this for cookies to be stored on browser.
    origin: [
        'http://localhost:3000',
        'https://ryflect.ca',
        'https://www.ryflect.ca'
    ] // Localhost and website public ip
}));
app.use(mongoSanitize());
app.use(JSONValidator());
app.use(cookieParser());
app.use('/api', router);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

cron.beginCrons();

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("[INFO] Connected to MongoDB!");
}).catch((err) => {
    console.log("[INFO] Cannot connect to MongoDB: ", err);
});

// All get requests not handled by our other routes serve the front end
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Setup express server to listen on port
app.listen(PORT, async () => {
    console.log(`
                         __ _           _   
                        / _| |         | |  
             _ __ _   _| |_| | ___  ___| |_ 
            | '__| | | |  _| |/ _ \\/ __| __|
            | |  | |_| | | | |  __/ (__| |_ 
            |_|   \\__, |_| |_|\\___|\\___|\\__|
                   __/ |          ${ENV}          
                  |___/           PORT: ${PORT}          
    `)
});