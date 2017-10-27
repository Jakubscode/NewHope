const express = require('express')
const _admin = require('../api/admin.js')
const _user = "admin"
const _pass = "admin"
const token = "2093klsdmkljio4358ioawdksml"

module.exports = (app) => {
  const admin = _admin(app)
  const router = express.Router();
  router.post("/login", async (req,res) => {
    const user = req.body.user
    const pass = req.body.pass
    const status = await admin.login(user, pass)
    if (status.success) {
      res.json({
        success: true,
        token : status.token,
      })
    }
    else {
      res.json({
        success: false,
      })
    }
  })
  router.get("/challenges", (req,res) => {
    res.json({
      challenges : [
        {
          name : "challenges 1",
          description : "Lorem Ipsum"
        },
        {
          name : "challenges 2",
          description : "Lorem Ipsum"
        },
        {
          name : "challenges 3",
          description : "Lorem Ipsum"
        }
      ]
    })
  })
  // router.post("/newadmin", (req,res) => {
  //   console.log(app.models.Admin)
  //   const a = new app.models.Admin({
  //     token : "2093klsdmkljio4358ioawdksml",
  //     login : "admin",
  //     pass : "846731ba01aa2ae7cda7361ed69d309661589c3d48056b56580170fb6c939233"
  //   })
  //   a.save()
  //     .then((err) => {
  //       console.log(err)
  //     })
  // })
  return router
}