const express = require('express');
const router = express.Router();
const ExampleRoute = require('./ExampleRoute.js');
const JournalRoute = require('./JournalRoute.js');
const AuthRoute = require('./AuthRoute.js');

router.use('/example', ExampleRoute);
router.use('/journals', JournalRoute);
router.use('/auth', AuthRoute);

module.exports = router;