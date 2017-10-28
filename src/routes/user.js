const express = require('express')
const user = require('../api/user')

module.exports = (app) => {
    const _user = user(app)
    const router = express.Router();
    router.post('/login', async (req, res) => {
        const response = await _user.login(req.body.userId, req.body.accessTokenId);
        res.statusCode = 200
        res.send(response)
    })

    router.get('/:userId/challanges', async (req,res) => {
        const response = await _user.getUserChallanges(req.params.userId)
        res.statusCode = 200
        res.send(response)
    })
    return router
}