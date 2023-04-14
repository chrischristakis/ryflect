const express = require('express');
const router = express.Router();
const ExampleRoute = require('./ExampleRoute.js');

router.use('/example', ExampleRoute);

module.exports = router;