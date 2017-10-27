const express = require('express')
const user = require('../api/user')

module.exports = (app) => {
  const router = express.Router();
  router.post('/login', async (req, res) => {
      const response = await user(app).login(req.body.userId, req.body.accessTokenId);
      res.statusCode = 200
      res.send(response)
  })
  return router
}