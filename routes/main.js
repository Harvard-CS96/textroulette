const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

const router = express.Router();

router.get('/', (req, res) => {
    res.sendfile(path.join(DIR.PUBLIC, "index.html"))
})

router.get('/login', (req, res) => {
    res.render("login", {
        fb_id: process.env.FB_ID
    })
})


module.exports = router;
