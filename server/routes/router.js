const express = require('express');
const router = express.Router();
const JournalRoute = require('./JournalRoute.js');
const AuthRoute = require('./AuthRoute.js');

router.use('/journals', JournalRoute);
router.use('/auth', AuthRoute);

module.exports = router;