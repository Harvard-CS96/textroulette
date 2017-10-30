const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

var questions = require(path.join(DIR.ROOT, 'controllers/questions'));

const router = express.Router();


var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
router.use(express.json());       // to support JSON-encoded bodies
router.use(express.urlencoded());




router.get('/', (req, res) => {
    res.sendFile(path.join(DIR.PUBLIC, "index.html"))
})

router.get('/questions/', questions.findForUser);

router.get('/questions', questions.findAll);


router.get('/updatePreferences', (req, res) => {
    res.sendfile(path.join(DIR.PUBLIC, "updatePreferences.html"))
})

router.post('/updatePreferences', (req, res) => {
    res.send(req.body)
})

module.exports = router;

