const express = require('express')

const _user = "admin"
const _pass = "admin"
const token = "2093klsdmkljio4358ioawdksml"

module.exports = () => {
  const router = express.Router();
  router.post("/login", (req,res) => {
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
    console.log(req)
    const user = req.body.user
    const pass = req.body.pass
    console.log(user,pass)
    if (user == _user && pass == _pass) {
        res.json({
            success : true,
            token
        })
    }
    else {
        res.json({
            success : false
        })   
    }
  })
  return router
}