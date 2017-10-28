const getAllFriendsUsers = app => async (fbID)  => {
    const User = app.models.User;
    const user = await User.findOne({fbID}).exec()
    const fbFriends = await User.find({ fbID: {$in: user.fbFriends } })
    return { fbFriends: fbFriends.map(friendsData => ({
            id: friendsData.fbID,
            name: friendsData.name,
            imgUrl: friendsData.img_url,
        }))
    }
}



module.exports = (app) => ({
    getAllFriendsUsers: getAllFriendsUsers(app)
})