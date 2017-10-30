const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

var questions = require(path.join(DIR.ROOT, 'controllers/questions'));

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(DIR.PUBLIC, "index.html"))
})

router.get('/questions/', questions.findForUser);

router.get('/questions', questions.findAll);

// router.get('/questions/', function(req, res) {
//    console.log('made it');
//    console.log(req.query);
//    res.send('{"id": 1,"name":"Matt","band":"BBQ Brawlers"}');
// });

module.exports = router;

