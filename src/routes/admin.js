const express = require('express')
const _admin = require('../api/admin.js')
//const token = "2093klsdmkljio4358ioawdksml"

module.exports = (app) => {
  const admin = _admin(app)
  const router = express.Router();
  router.use(async (req, res, next) => {
    const token = req.token;
    const auth = await admin.auth(token)
    console.log(req.path, auth)
    console.log("auth middleware")
    if (auth != null || req.path == '/login') {
      console.log("auth success")
      if (auth != null) {
        req.admin_id = auth._id
      }
      next()
    }
    else {
      console.log("auth fail")
      res.status(403)
      res.end()
    }
  });
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
      res.status(403)
      res.json({
        success: false,
      })
    }
  })
  router.get("/challenges", async (req,res) => {
    const challenges  = await admin.getChallenges()
    console.log(challenges)
    res.json(challenges)
  })
  router.get("/challenges/:id", async (req,res) => {
    const id = req.params.id
    const challenge = await admin.getChallenge(id)
    res.json(challenge)
  })
  router.post("/challenges", async (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const users = req.body.users
    const status = await admin.addChallenge(name, description, image, users, req.admin_id)
    res.json(status)
  })
  router.post("/find", async (req, res) => {
    const users = await admin.findUser(req.body.name)
    res.send(users)
  })
  router.get("/user/:id", async (req, res) => {
    const user = await admin.getUser(req.params.id)
    res.send(user)
  })
  router.post("/messages/", async (req, res) => {
    const message = await admin.sendMessage({
      user_id : req.body.user_id,
      challenge_id : req.body.challenge_id,
      text : req.body.text,
      image : req.body.image,
      topic : req.body.topic
    })
    res.json(message)
  })
  router.get("/messages/", async (req, res) => {
    const messages = await admin.getMessages()
    res.json(messages)
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