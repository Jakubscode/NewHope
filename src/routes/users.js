const express = require('express')
const users = require('../api/users.js')

module.exports = (app) => {
    const _users = users(app)
    const router = express.Router();
    router.get('/:userId', async (req, res) => {
        const response = await _users.getAllFriendsUsers(req.params.userId)
        res.statusCode = 200
        res.send(response)
    })
    return router
}