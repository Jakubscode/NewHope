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
    if (auth || req.path == '/login') {
      next()
    }
    else {
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
  router.get("/challenges", (req,res) => {
    res.json({
      challenges : [
        {
          id : "spfajg3049",
          name : "challenges 1",
          description : "Lorem Ipsum"
        },
        {
          id : "sdfsdf",
          name : "challenges 2",
          description : "Lorem Ipsum"
        },
        {
          id : "asdasd",
          name : "challenges 3",
          description : "Lorem Ipsum"
        }
      ]
    })
  })
  router.get("/challenges/:id", (req,res) => {
    const id = req.params.id
    res.json({
      challenge: {
          id : id,
          name : "challenges 1",
          description : "Lorem Ipsum"
      }
    })
  })
  router.post("/challenges", (req, res) => {
    console.log(req.body)
    //console.log(req.body)
    res.send("yeah")
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