const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

const router = express.Router();

router.get('/', (req, res) => {
    res.sendfile(path.join(DIR.PUBLIC, "index.html"))
})

module.exports = router;