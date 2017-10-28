const express = require('express')
const user = require('../api/user')

module.exports = (app) => {
    const _user = user(app)
    const router = express.Router();
    router.post('/login', async (req, res) => {
        const response = await _user.login(req.body.userId, req.body.accessTokenId, req.body.firebaseToken);
        res.statusCode = 200
        res.send(response)
    })

    router.get('/:userId/challenges', async (req,res) => {
        const response = await _user.getUserChallenges(req.params.userId)
        res.statusCode = 200
        res.send(response)
    })
    router.get('/:userId/challenges/:idChallenge', async (req, res) => {
        const response = await _user.getChallenge(req.params.idChallenge)
        res.statusCode = 200
        res.send(response)
    })
    router.get('/:userId/messages', async (req,res) => {
        const response = await _user.getUserMessages(req.params.userId)
        res.statusCode = 200
        res.send(response)
    })
    return router
}