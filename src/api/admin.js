const login = (app) => (user, pass) => {
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
}


module.exports = (app) => ({
	login : login(app)
})