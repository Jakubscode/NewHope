const getAllUsers = app => async ()  => {
    const User = app.models.User;
    const usersData = await User.find({}).exec()
    return { userData }
}



module.exports = (app) => ({
    getAllUser: getAllUsers(app)
})