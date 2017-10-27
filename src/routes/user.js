const express = require('express')
const user = require('../api/user')

module.exports = (app) => {
  const router = express.Router();
  router.post('/login', async (req, res) => {
      const updated = await user(app).login(req.body.userId, req.body.accessTokenId);
      res.send(true).code(200);
  })
  return router
}