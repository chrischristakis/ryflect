const express = require('express');
const router = express.Router();
const ExampleRoute = require('./ExampleRoute.js');
const JournalRoute = require('./JournalRoute.js');

router.use('/example', ExampleRoute);
router.use('/journals', JournalRoute);

module.exports = router;