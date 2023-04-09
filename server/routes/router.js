const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Woah router!");
});

module.exports = router;