const loginUser = (app) => (fbID) => {
    // return app.models.User.find({ fbID }).exec()
}


module.exports = (app) => ({
    login : loginUser(app)
})