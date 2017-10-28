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
    router.get('/challenges/:idChallenge', async (req, res) => {
        const response = await _user.getChallenge(req.params.idChallenge)
        res.statusCode = 200
        res.send(response)
    })
    router.get('/:userId/challenges/:idChallenge', async (req, res) => {
        const response = await _user.acceptChallenge(req.params.userId, req.params.idChallenge)
        res.statusCode = 200;
        res.send(response)
    })
    router.get('/:userId/messages', async (req,res) => {
        const response = await _user.getUserMessages(req.params.userId)
        res.statusCode = 200
        res.send(response)
    })
    router.post('/:userId/commitPayment', async (req,res) => {
    		const fbID = req.params.userId
		    const challenge_id = req.body.challenge_id
		    const user_challenge_id	 = req.body.user_challenge_id	   
		    const amount = req.body.amount
		    const data = {
        	fbID,
        	challenge_id,
        	user_challenge_id,
        	amount
        }
        const response = await _user.commitPayment(data)
        res.statusCode = 200
        res.send(response)
    })
    router.get('/:userId/payments', async (req,res) => {
    		const response = await _user.getUserPayments(req.params.userId)
        res.statusCode = 200
        res.send(response)
    })
    return router
}