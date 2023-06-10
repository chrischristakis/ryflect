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

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' // Only needed in dev since in prod, will be served statically.
}));
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

cron.beginCrons();

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
    console.log(`Running Ryflect as a ${ENV} app on port = ${PORT}`);
});