const express = require('express');

const createUtilRoute = function (matcher) {
    const router = express.Router();

    router.get('/connections', (req, res) => {
        res.end(matcher.prettyPrint())
    })

    return router;
}

module.exports = createUtilRoute;