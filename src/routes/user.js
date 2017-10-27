const express = require('express')
const user = require('../api/user')

module.exports = (app) => {
  const router = express.Router();
  router.post('/', async (req, res) => {
      await user(app).login(req.body.userId, req);
      res.send(true).code(200);
  })
  return router
}