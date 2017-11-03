const express = require('express');

const createUtilRoute = function (matcher) {
    const router = express.Router();

    router.get('/connections', (req, res) => {
        res.end(matcher.prettyPrint())
    })

    router.get('/matcher-log', (req, res) => {
        res.end(matcher.logAll())
    })

    return router;
}

module.exports = createUtilRoute;