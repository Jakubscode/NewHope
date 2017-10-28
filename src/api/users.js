const getAllFriendsUsers = app => async (fbID)  => {
    const User = app.models.User;
    const friends = await User.find()
    return { usersData }
}



module.exports = (app) => ({
    getAllFriendsUsers: getAllFriendsUsers(app)
})