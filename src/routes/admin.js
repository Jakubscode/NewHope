const express = require('express')
const _admin = require('../api/admin.js')
const _user = "admin"
const _pass = "admin"
const token = "2093klsdmkljio4358ioawdksml"

module.exports = (app) => {
  const admin = _admin(app)
  const router = express.Router();
  router.post("/login", (req,res) => {
    const user = req.body.user
    const pass = req.body.pass
    admin.login()
  })
  return router
}