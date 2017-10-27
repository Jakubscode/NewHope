const express = require('express')



module.exports = () => {
  const router = express.Router();
  router.post("/", (req,res) => {
    res.json({
        challenges : true
    })
  })
  return router
}